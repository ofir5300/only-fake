import { Article, CATEGORIES } from "@only-fake/shared";
import { OpenAIService } from "./OpenAI";
import { z } from "zod";
import { SYSTEM_PROMPTS } from "./prompts";

const fakeArticleSchema = z.object({
  fake_title: z.string().optional().describe("A fake version of the title"),
  fake_description: z
    .string()
    .optional()
    .describe("A fake version of the description"),
  category: z
    .nativeEnum(CATEGORIES)
    .optional()
    .describe("A category for the original article"),
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
