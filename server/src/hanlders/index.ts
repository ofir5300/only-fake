import {
  API_ENDPOINTS,
  FakeArticle,
  HealthCheckResponse,
} from "@only-fake/shared";
import { getCNNArticles } from "./articles";
import { Router, Request, Response } from "express";

const getCNNArticlesHandler = async (
  _req: Request,
  res: Response<FakeArticle[]>
) => {
  res.json(await getCNNArticles({ limit: 1 }));
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
  router.get(API_ENDPOINTS.CNN, getCNNArticlesHandler);

  return router;
};
