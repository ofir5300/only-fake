import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { getPromptTemplateWithInput } from "./prompts";

export class OpenAIService {
  private static instance: OpenAIService;
  private llm: ChatOpenAI;

  private constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 1.1, // have a bit of fun and creativity!
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async invokeWithStructure<T>({
    systemPrompt,
    objectToQuestion,
    schema,
  }: {
    systemPrompt: string;
    objectToQuestion: any;
    schema: z.ZodSchema<T>;
  }): Promise<T> {
    try {
      const llm = getPromptTemplateWithInput(systemPrompt).pipe(
        this.llm.withStructuredOutput(schema)
      );

      const response = await llm.invoke({
        input: objectToQuestion,
      });

      return response as T;
    } catch (error: any) {
      console.error("Error invoking with structure:", error);
      throw new Error("Failed to invoke with structure" + error?.toString());
    }
  }

  // Keep the original method for other uses
  public async invoke(question: string): Promise<string> {
    try {
      const response = await this.llm.invoke([
        new HumanMessage({
          content: question,
        }),
      ]);

      return response.content.toString();
    } catch (error: any) {
      console.error("Error calling OpenAI:", error);
      throw new Error("Failed to get response from OpenAI" + error?.toString());
    }
  }
}
