import { extractAndTransform } from "../fetchers";
import { OpenAIService } from "../llm/OpenAI";
import { FakeArticle, NewsSource, SOURCES } from "@only-fake/shared";

type GetArticlesParams = {
  source: NewsSource;
  limit?: number;
};

export const getArticles = async ({
  source,
  limit = 10,
}: GetArticlesParams): Promise<FakeArticle[]> => {
  const articles = await extractAndTransform(source);
  const openai = OpenAIService.getInstance();
  const fakeArticles = await Promise.all(
    //  todo stream here
    // maybe with generators?
    articles.slice(0, limit).map(async (article: any) => ({
      ...article,
      ...(await openai.generateFakeArticle(article)),
    }))
  );
  console.log(fakeArticles);
  return fakeArticles;
};
