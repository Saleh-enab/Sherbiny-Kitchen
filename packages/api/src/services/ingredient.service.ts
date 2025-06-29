import db from "../db.js";

export const findAllIngredients = async () => {
    const ingredients = await db.ingredient.findMany({});
    return ingredients;
}