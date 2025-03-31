import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import type { FakeArticle, Article } from "@only-fake/shared";

// Define Zod schema based on FakeArticle type
const fakeArticleSchema = z.object({
  fake_title: z.string().optional(),
  fake_description: z.string().optional(),
  category: z.string().optional(),	//	todo enum
});

export class OpenAIService {
  private static instance: OpenAIService;
  private llm: ChatOpenAI;
  private parser: StructuredOutputParser<typeof fakeArticleSchema>;

  private constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 1.1,
    });

    this.parser = StructuredOutputParser.fromZodSchema(fakeArticleSchema);
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async generateFakeArticle(
    originalArticle: Article
  ): Promise<FakeArticle> {
    try {
      const formatInstructions = this.parser.getFormatInstructions();

      const response = await this.llm.invoke([
        new SystemMessage({
          content: `You are a creative writer who generates fake news out of real news articles. 
					Make sure output article is super funny and absurd .
					Make sure output stays somehow true and related to the original article.
                   ${formatInstructions}`,
        }),
        new HumanMessage({
          content: `Generate the fake fields and category given this (real) article: ${JSON.stringify(
            originalArticle
          )}`,
        }),
      ]);

      const parsedResponse = await this.parser.parse(
        response.content.toString()
      );
      return parsedResponse;
    } catch (error) {
      console.error("Error generating fake article:", error);
      throw new Error("Failed to generate fake article");
    }
  }

  // Keep the original method for other uses
  public async askQuestion(question: string): Promise<string> {
    try {
      const response = await this.llm.invoke([
        new HumanMessage({
          content: question,
        }),
      ]);

      return response.content.toString();
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      throw new Error("Failed to get response from OpenAI");
    }
  }
}
