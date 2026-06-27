import { Router } from "express";
import * as db from "../db/index";
import type { QueryResult } from "pg";
import type { Movie } from "../types";

const router = Router();

router.post("/movies/add", async (req, res) => {
    const { title, description, duration_minutes, release_date, schedules } =
        req.body;
    const client = await db.connect();
    try {
        await client.query("BEGIN");
        const movieResults: QueryResult<Movie> = await client.query(
            'INSERT INTO "Movies" (title, description, duration_minutes, release_date) VALUES ($1, $2, $3, $4) RETURNING movie_id',
            [title, description, duration_minutes, release_date]
        );
        const movie_id = movieResults.rows[0]?.movie_id;
        if (!movie_id) {
            throw new Error("Movie insert failed. No ID returned.");
        }

        for (const schedule of schedules) {
            await client.query(
                'INSERT INTO "Movie_Schedules" (movie_id, screen_id, start_time, end_time) VALUES ($1, $2, $3, $4)',
                [
                    movie_id,
                    schedule.screen_id,
                    schedule.start_time,
                    schedule.end_time,
                ]
            );
        }
        await client.query("COMMIT");
        res.status(201).json({ message: "Movies and its schedules added" });
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).json({
            message: "Failed to add movie",
        });
        console.error(err);
    }
});

router.get("/:theater_id/screens", async (req, res) => {
    const { theater_id } = req.params;
    try {
        const sql = `
            SELECT s.screen_id, s.screen_number, st.screen_name 
            FROM "Users" u 
            JOIN "Screens" s 
                ON u.theater_id = s.theater_id 
            JOIN "screen_types" st 
                ON s.screen_type = st.screen_type_id 
            WHERE u.theater_id = $1
        `;
        const screens = await db.query(sql, [theater_id]);
        res.status(200).json(screens.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to load screens",
        });
    }
});

router.get("/genres", async (req, res) => {
    try {
        const genres = await db.query("SELECT * FROM genres", []);
        res.status(200).json(genres.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to load genres",
        });
    }
});

export default router;
