import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getRouter } from "./hanlders";

dotenv.config();

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", getRouter());

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
