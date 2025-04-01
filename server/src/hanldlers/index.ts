import {
  API_ENDPOINTS,
  FakeArticle,
  HealthCheckResponse,
  NewsSource,
  SSEEvent,
} from "@only-fake/shared";
import { generateArticles, getArticles } from "./articles";
import { Router, Request, Response } from "express";

const getArticlesHandler = async (
  req: Request<{ source: NewsSource }>,
  res: Response<FakeArticle[]>
) => {
  const source = req.params.source as NewsSource;
  res.json(await getArticles({ source, limit: 10 }));
};

const getHealthCheckHandler = (
  _req: Request,
  res: Response<HealthCheckResponse>
) => {
  res.json({ status: "ok", message: "Server is running!" });
};

const getArticlesStreamHandler = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const source = req.params.source as NewsSource;
  const sendEvent = (data: SSEEvent) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    for await (const article of generateArticles({ source, limit: 10 })) {
      sendEvent({ type: "article", data: JSON.stringify(article) });
    }
    sendEvent({ type: "done", data: "" });
  } catch (error: any) {
    console.error(`Error streaming articles for ${source}:`, error?.toString());
    sendEvent({ type: "error", data: error?.toString() });
  }

  // Handle client disconnect
  req.on("close", () => {
    console.log("Client disconnected from SSE");
  });
};

export const getRouter = (): Router => {
  const router = Router();
  router.get(API_ENDPOINTS.HEALTH, getHealthCheckHandler);
  router.get(`${API_ENDPOINTS.ARTICLES}/:source`, getArticlesHandler);
  router.get(
    `${API_ENDPOINTS.ARTICLES_STREAM}/:source`,
    getArticlesStreamHandler
  );

  return router;
};
