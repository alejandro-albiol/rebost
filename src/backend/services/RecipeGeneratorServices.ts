import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class RecipeGeneratorServices {
  static async main() {
    const ingredients = process.argv.slice(2).join(", ");
    const chatCompletion = await RecipeGeneratorServices.getGroqChatCompletion(ingredients);
    
    const rawJson = chatCompletion.choices[0]?.message?.content || "";
    console.log("Received JSON string:", rawJson);

    try {
      const recipes = JSON.parse(rawJson);
      console.log("Parsed recipes:", recipes);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  static async getGroqChatCompletion(ingredients: string) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Send only three recipes easy to cook and tasty that contain the following ingredients: ${ingredients}. Return the recipes in JSON format with fields 'title', 'description'. Send only the JSON, without any other text or markup. In title use the name of the recipe, in description explain how to cook it.`,
        },
      ],
      model: "llama3-8b-8192",
    });
  }
}
