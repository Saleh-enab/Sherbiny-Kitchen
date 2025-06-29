export interface User {
    id: string
    name: string
    email: string
    verified: boolean
    createdAt: string
    updatedAt: string
}

export interface UserRegistration {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface UserLogin {
    email: string
    password: string
}

export interface LoginResponse {
    validUser: boolean
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: string
    refreshTokenExpiresIn: string
}

// Ingredient basic info
export interface Ingredient {
    slug: string
    name: string
}

// Ingredient inside a saved recipe (from DB)
export interface RecipeIngredient {
    recipeSlug: string
    ingredientSlug: string
    quantity: number
    measure: 'PIECE' | 'PACKET' | 'GRAM' | 'KILOGRAM' | 'SPOON' | 'CUP'
    Ingredient: Ingredient
}

// Ingredient inside a generated recipe (before saving)
export interface RecipeIngredientInput {
    name: string
    quantity: number
    measure: 'PIECE' | 'PACKET' | 'GRAM' | 'KILOGRAM' | 'SPOON' | 'CUP'
}

// Generated recipe (from AI before saving)
export interface GeneratedRecipe {
    recipeName: string
    timeInMinutes: number
    steps: string[]
    ingredients: RecipeIngredientInput[]
    country: string
}

export interface StoredRecipe {
    slug: string
    name: string
    country: string
    timeInMinutes: number
    steps: string[]
    createdAt: string
    updatedAt: string
    userId: string
    RecipeToIngredient: RecipeIngredient[]
}

export interface GenerateRecipeRequest {
    ingredients: RecipeIngredientInput[]
    options: string[]
    country: string
    dishType: 'MAIN' | 'DESSERT' | 'APPETIZER' | 'SNACK'
}

export interface GetMyRecipesResponse {
    count: number
    recipes: StoredRecipe[]
}

export interface GetGeneratedRecipeResponse {
    finalResult: GeneratedRecipe
    recipeKey: string
    todayAttemps: number
    remainingAttemps: number
}

// Alias for backward compatibility
export type GenerateRecipeResponse = GetGeneratedRecipeResponse
export type Recipe = GeneratedRecipe

export interface ApiError {
    errorCode: number
    error: string
}

export interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (userData: UserRegistration) => Promise<void>
    logout: () => void
    loading: boolean
} 