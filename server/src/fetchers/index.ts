import {
  Article,
  Extractor,
  NewsSource,
  SOURCES,
  Transformer,
} from "@only-fake/shared";
import { extractCNNRss, transformCNNArticles } from "./cnn";

const extractors: Record<NewsSource, Extractor> = {
  [SOURCES.CNN]: extractCNNRss,
};

const transformers: Record<NewsSource, Transformer> = {
  [SOURCES.CNN]: transformCNNArticles,
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
  } catch (error) {
    console.error(`Failed to fetch ${source} feed:`, error);
    return [];
  }
};
