import { GenerateRecipeMiddleware } from "../../schemas/generateRecipe.js";
import { getAiRecipe } from "../../services/gemini.service.js";
import { PromptInputs } from "../../types/promptInputs.js";
import { promptBuilder } from "../../utils/promptBuilder.js";


export const generateRecipe: GenerateRecipeMiddleware = async (req, res) => {
    const { ingredients, options, country, dishType } = req.body;
    const promptInputs: PromptInputs = {
        ingredients,
        options,
        country,
        dishType
    }

    const prompt = promptBuilder(promptInputs);

    const modelResult = await getAiRecipe(prompt);
    const cleaned = modelResult
        .replace(/^```json\s*/i, '')  // remove starting ```json (case-insensitive)
        .replace(/^```\s*/i, '')      // fallback: just ```
        .replace(/\s*```$/, '');      // remove trailing ```
    const finalResult = JSON.parse(cleaned);

    return res.json(finalResult);
}