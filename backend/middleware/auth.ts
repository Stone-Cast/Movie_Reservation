import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as db from "../db/index";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ loggedIn: false, message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ loggedIn: false, message: "Invalid token" });
    }
};

export const verifyAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ loggedIn: false, message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;

        const sql = 'SELECT role FROM "Users" WHERE user_id=$1';
        const values = [req.user.sub];

        const userResult = await db.query(sql, values);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = userResult.rows[0];
        if (user.role !== 0) {
            return res
                .status(403)
                .json({ message: "Your admin cape has been confiscated." });
        }
        next();
    } catch (err) {
        const error = err as Error;
        console.log(error.message);
        res.status(401).json({ message: "Invalid token" });
    }
};
