import { Article } from "@only-fake/shared";
import { OpenAIService } from "./OpenAI";
import { z } from "zod";
import { SYSTEM_PROMPTS } from "./prompts";
// Define Zod schema based on FakeArticle type
const fakeArticleSchema = z.object({
  fake_title: z.string().optional(),
  fake_description: z.string().optional(),
  category: z.string().optional(), //	todo enum
});

type FakeArticleOutput = z.infer<typeof fakeArticleSchema>;

export const generateFakeArticle = async (
  originalArticle: Article
): Promise<FakeArticleOutput> => {
  try {
    const openai = OpenAIService.getInstance();

    const response = await openai.invokeWithStructure<FakeArticleOutput>({
      systemPrompt: SYSTEM_PROMPTS.ARTICLE,
      objectToQuestion: originalArticle,
      schema: fakeArticleSchema,
    });

    return response;
  } catch (error) {
    console.error("Error generating fake article:", error);
    throw new Error("Failed to generate fake article");
  }
};
