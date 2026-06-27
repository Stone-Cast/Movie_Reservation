import { Router } from "express";
import bcrypt from "bcrypt";
import * as db from "../db/index.ts";
import jwt from "jsonwebtoken";
import { DatabaseError, type QueryResult } from "pg";
import type { FormatResponse, User } from "../types.ts";
import { verifyUser } from "../middleware/auth.ts";

const router = Router();

const formatResponse = (user: any): FormatResponse => ({
    loggedIn: true,
    user: {
        sub: user.user_id ?? user.sub,
        name: user.username ?? user.name,
        rol: user.role ?? user.rol,
        theater: user.theater_id ?? user.thtr,
    },
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const sql =
            'INSERT INTO "Users" (username, email, password_hash) VALUES ($1, $2, $3)';
        const values = [username, email, hash];

        await db.query(sql, values);

        res.status(201).json({ message: "User created" });
    } catch (err) {
        if (err instanceof DatabaseError && err.code === "23505") {
            return res.status(409).json({
                message:
                    "An account with this email already exists. Try signing in instead.",
            });
        }
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = 'SELECT * FROM "Users" WHERE email=$1';
        const values = [email];

        const response: QueryResult<User> = await db.query(sql, values);
        const user = response.rows[0];

        if (!user)
            return res
                .status(401)
                .json({ message: "Inavlid email or password" });

        const compareResult = await bcrypt.compare(
            password,
            user.password_hash
        );
        if (!compareResult)
            return res
                .status(401)
                .json({ message: "Invalid email or password" });

        const payload = {
            sub: user.user_id,
            name: user.username,
            rol: user.role,
            thtr: user.theater_id,
        };
        const secretKey = process.env.JWT_SECRET;

        if (!secretKey)
            throw new Error(
                "JWT_SECRET is not defined in environment variables"
            );

        const token = jwt.sign(payload, secretKey);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, //set it to true during production
            maxAge: 3600000,
            path: "/",
        });

        res.status(200).json(formatResponse(user));
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.json({ message: "Logged out successfully." });
});

router.get("/me", verifyUser, async (req, res) => {
    res.json(formatResponse(req.user));
});

export default router;
