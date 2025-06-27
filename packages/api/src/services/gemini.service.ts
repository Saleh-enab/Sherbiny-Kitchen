import { GoogleGenAI } from '@google/genai';
import env from '../env.js';
import AppError from '../models/appError.js';
import { errorCodes } from '../config/errors.js';


const GEMINI_API_KEY = env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const getAiRecipe = async (prompt: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt
    });

    if (!response.text) {
        throw AppError.custom(500, errorCodes.unexpected, "Empty AI Response")
    }

    return response.text;
}