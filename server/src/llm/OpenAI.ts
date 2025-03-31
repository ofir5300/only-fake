import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class OpenAIService {
  private static instance: OpenAIService;
  private model: ChatOpenAI;

  private constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 1.1,
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async askQuestion(question: string): Promise<string> {
    try {
      const response = await this.model.invoke([
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
