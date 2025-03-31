import { fetchCNNRss } from "../fetchers/cnn";
import { OpenAIService } from "../llm/OpenAI";
import { FakeArticle } from "@only-fake/shared";

type GetArticlesParams = {
  limit?: number;
};

//  todo stream here
// maybe with generators?
export const getCNNArticles = async ({
  limit = 10,
}: GetArticlesParams): Promise<FakeArticle[]> => {
  const articles = await fetchCNNRss();
  const openai = OpenAIService.getInstance();
  const fakeArticles = await Promise.all(
    articles.slice(0, limit).map(async (article: any) => {
      return await openai.generateFakeArticle(article);
    })
  );
  console.log(fakeArticles);
  return fakeArticles;
};
