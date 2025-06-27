import fs from 'fs';
import path from 'path';
import { PromptInputs } from '../types/promptInputs.js';


export const promptBuilder = (inputs: PromptInputs): string => {
    const templateFilePath = path.join(import.meta.dirname, "../../templates/promptTemplate.txt")
    const promptTemplate = fs.readFileSync(templateFilePath, 'utf-8');
    const prompt = promptTemplate
        .replace('{{INGREDIENTS_OBJECT}}', JSON.stringify(inputs.ingredients))
        .replace('{{OPTIONS_ARRAY}}', JSON.stringify(inputs.options))
        .replace('{{COUNTRY_STRING}}', inputs.country === 'random' ? 'random country' : inputs.country)
        .replace('{{DISH_TYPE_STRING}}', inputs.dishType);

    return prompt;
}

