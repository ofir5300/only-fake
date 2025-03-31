import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running!" });
});

app.get("/api/dummy-data", (_req: Request, res: Response) => {
  res.json({
    message: "This is dummy data from the server!",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
