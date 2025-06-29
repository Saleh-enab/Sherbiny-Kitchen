import { RequestHandler } from "express";
import { findAllIngredients } from "../../services/ingredient.service.js";

export const getAllIngredients: RequestHandler = async (req, res) => {
    const ingredients = await findAllIngredients();
    res.json({ count: ingredients.length, ingredients });
}