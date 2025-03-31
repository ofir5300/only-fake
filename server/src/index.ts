import express, { Request, Response } from "express";
import cors from "cors";
import { HealthCheckResponse, API_ENDPOINTS } from "@only-fake/shared";
import { fetchCNNRss } from "./fetchers/cnn";

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

app.get(API_ENDPOINTS.DUMMY_DATA, async (_req: Request, res: Response) => {
  const articles = await fetchCNNRss();
  console.log("CNN Top Headlines:");
  articles.forEach((a: any, i: number) => {
    console.log(`${i + 1}. ${a.title}`);
  });
  res.json({
    message: JSON.stringify(articles[0]),
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
