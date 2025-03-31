import express, { Request, Response } from "express";
import cors from "cors";
import { HealthCheckResponse, API_ENDPOINTS } from "@only-fake/shared";

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get(
  API_ENDPOINTS.HEALTH,
  (_req: Request, res: Response<HealthCheckResponse>) => {
    res.json({ status: "ok", message: "Server is running!" });
  }
);

app.get(API_ENDPOINTS.DUMMY_DATA, (_req: Request, res: Response) => {
  res.json({
    message: "This is dummy data from the server!",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
