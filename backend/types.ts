import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

export type User = {
    user_id: string;
    username: string;
    email: string;
    password_hash: string;
    role: number;
    theater_id: number | null;
};

export type Movie = {
    movie_id: string;
    title: string;
    description: string;
    duration_minutes: number;
    release_date: Date;
};

export interface AppJwtPayload extends JwtPayload {
    sub: string;
    rol: number;
}

export interface FormatResponse {
    loggedIn: boolean;
    user: {
        sub: string;
        name: string;
        rol: number;
        theater: number | null;
    };
}
