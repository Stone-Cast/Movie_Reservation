import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import moviesRoutes from "./routes/movies";
import { verifyAdmin } from "./middleware/auth";

const app = express();
const port = 3000;

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:8000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use("/", moviesRoutes);
app.use("/auth", authRoutes);
app.use("/admin", verifyAdmin, adminRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default app;
