import {
  Article,
  Extractor,
  NewsSource,
  SOURCES,
  Transformer,
} from "@only-fake/shared";
import { extractCNNRss, transformCNNArticles } from "./cnn";

const extractors: Record<NewsSource, Extractor | null> = {
  [SOURCES.CNN]: extractCNNRss,
  [SOURCES.GEEKTIME]: null,
};

const transformers: Record<NewsSource, Transformer | null> = {
  [SOURCES.CNN]: transformCNNArticles,
  [SOURCES.GEEKTIME]: null,
};

export const extractAndTransform = async (
  source: NewsSource
): Promise<Article[]> => {
  try {
    const extractor = extractors[source];
    const transformer = transformers[source];

    if (!extractor || !transformer) {
      throw new Error(
        `No extractor or transformer found for source: ${source}`
      );
    }

    const rawData = await extractor();
    const articles = transformer(rawData);

    return articles;
  } catch (error: any) {
    console.error(`Failed to fetch ${source} feed:`, error);
    throw error;
  }
};
