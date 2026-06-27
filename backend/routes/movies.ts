import { Router } from "express";
import * as db from "../db/index";

const router = Router();

const DOMAIN_MAP: Record<string, number> = {
    "cinemax.com": 1,
    "grandcinema.com": 2,
    "movies-on-air.vercel.app": 3,
};

router.get("/movies", async (req, res) => {
    const host = req.hostname;
    const theater_id = DOMAIN_MAP[host];
    try {
        const sql =
            'SELECT DISTINCT m.* FROM "Movies" m JOIN "Movie_Schedules" ms ON m.movie_id = ms.movie_id JOIN "Screens" s ON ms.screen_id = s.screen_id WHERE s.theater_id = $1';
        const values = [theater_id];

        const movies = await db.query(sql, values);
        res.json(movies.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch movies." });
    }
});

export default router;
