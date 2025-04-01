import { CATEGORIES, SOURCES } from "./consts";

// API Response Types
export interface HealthCheckResponse {
  status: string;
  message: string;
}

export interface Article {
  title: string;
  url: string;
  date: string;
  description: string;
}

export interface FakeArticle extends Article {
  fake_title?: string;
  fake_description?: string;
  category?: CATEGORIES;
}

export type Extractor = () => Promise<any[]>;
export type Transformer = (data: any[]) => Article[];

export type NewsSource = (typeof SOURCES)[keyof typeof SOURCES];

export type SSEEvent = {
  type: "article" | "error" | "done";
  data: string;
};
