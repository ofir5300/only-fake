import express, { Request, Response } from "express";
import cors from "cors";
import { HealthCheckResponse, API_ENDPOINTS } from "@only-fake/shared";
import { fetchCNNRss } from "./fetchers/cnn";
import { OpenAIService } from "./llm/OpenAI";
import dotenv from "dotenv";

dotenv.config();

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
  const openai = OpenAIService.getInstance();
  const response = await openai.askQuestion(
    `make this article's title a super funny and absurd fake title: ${articles[0].title}`
  );
  console.log("CNN Top Headlines:");
  articles.forEach((a: any, i: number) => {
    console.log(`${i + 1}. ${a.title}`);
  });
  res.json({
    message: JSON.stringify(response),
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
