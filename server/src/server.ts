import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import issueRoutes from "./controllers/issueController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
cors({
origin: "http://localhost:5173",
}),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
res.status(200).json({
success: true,
message: "DevTrack API is running!",
});
});

app.use("/api/issues", issueRoutes);

const startServer = async (): Promise<void> => {
try {
await connectDB();


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


} catch (error) {
console.error("Failed to start the server:", error);
process.exit(1);
}
};

startServer();
