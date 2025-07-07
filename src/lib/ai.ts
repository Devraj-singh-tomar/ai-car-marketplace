import "server-only";

import { google } from "@ai-sdk/google";
import { generateText, LanguageModelV1, zodSchema } from "ai";
import { GEMINI_FLASH } from "@/constants/config";
import { generateCarPrompt } from "./prompts";
import { addCarSchema } from "./zod";

class AIService {
  private model: LanguageModelV1;
  private searchModel: LanguageModelV1;

  constructor() {
    this.model = google(GEMINI_FLASH);

    this.searchModel = google(GEMINI_FLASH, {
      useSearchGrounding: true,
    });
  }

  generativeAI = async () => {};

  generateCarAgent = async (carName: string) => {
    const modifiedSchema = zodSchema(addCarSchema).jsonSchema;

    const { text } = await generateText({
      model: this.searchModel,
      messages: [
        {
          role: "assistant",
          content: generateCarPrompt,
        },
        {
          role: "assistant",
          content: "The car zod schema is: " + JSON.stringify(modifiedSchema),
        },
        {
          role: "user",
          content: `The car name is ${carName}`,
        },
      ],
    });

    return text;
  };

  searchAgent = async (carDescription: string) => {};
}

export const aiService = new AIService();
