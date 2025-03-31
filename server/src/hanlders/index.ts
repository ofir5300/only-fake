import {
  API_ENDPOINTS,
  FakeArticle,
  HealthCheckResponse,
  NewsSource,
} from "@only-fake/shared";
import { getArticles } from "./articles";
import { Router, Request, Response } from "express";

const getArticlesHandler = async (
  req: Request<{ source: NewsSource }>,
  res: Response<FakeArticle[]>
) => {
  const source = req.params.source as NewsSource;
  res.json(await getArticles({ source, limit: 2 }));
};

const getHealthCheckHandler = (
  _req: Request,
  res: Response<HealthCheckResponse>
) => {
  res.json({ status: "ok", message: "Server is running!" });
};

export const getRouter = (): Router => {
  const router = Router();
  router.get(API_ENDPOINTS.HEALTH, getHealthCheckHandler);
  router.get(`${API_ENDPOINTS.ARTICLES}/:source`, getArticlesHandler);

  return router;
};
