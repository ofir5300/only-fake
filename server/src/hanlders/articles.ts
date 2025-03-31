import { extractAndTransform } from "../fetchers";
import { OpenAIService } from "../llm/OpenAI";
import { FakeArticle, NewsSource, SOURCES } from "@only-fake/shared";

type GetArticlesParams = {
  source: NewsSource;
  limit?: number;
};

export async function* generateArticles({
  source,
  limit = 10,
}: GetArticlesParams): AsyncGenerator<FakeArticle> {
  const articles = await extractAndTransform(source);
  const openai = OpenAIService.getInstance();

  for (const article of articles.slice(0, limit)) {
    const fakeArticle = {
      ...article,
      ...(await openai.generateFakeArticle(article)),
    };
    yield fakeArticle;
  }
}

export const getArticles = async ({
  source,
  limit = 10,
}: GetArticlesParams): Promise<FakeArticle[]> => {
  const fakeArticles: FakeArticle[] = [];
  for await (const article of generateArticles({ source, limit })) {
    fakeArticles.push(article);
  }
  return fakeArticles;
};
