import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recipeAPI } from '../services/api'
import { StoredRecipe } from '../types'
import { Clock, Globe, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const MyRecipes = () => {
    const [recipes, setRecipes] = useState<StoredRecipe[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await recipeAPI.getMyRecipes()
                if (response.recipes) {
                    setRecipes(response.recipes)
                } else {
                    setRecipes([])
                }
            } catch (error) {
                toast.error('Failed to load recipes')
            } finally {
                setLoading(false)
            }
        }
        fetchRecipes()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (recipes.length === 0) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <BookOpen className="h-24 w-24 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">No recipes yet</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    You haven't saved any recipes yet. Generate your first recipe to get started!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
                <p className="mt-2 text-gray-600">
                    Your saved recipe collection ({recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'})
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe, index) => (
                    <Link
                        key={index}
                        to={`/recipes/${recipe.slug}`} // ⬅️ navigate to detailed page
                        className="card hover:shadow-lg transition-shadow duration-200 block space-y-4"
                    >
                        {/* Recipe Header */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {recipe.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{recipe.timeInMinutes} min</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Globe className="h-4 w-4" />
                                    <span>{recipe.country}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients Preview */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Ingredients</h4>
                            <div className="space-y-1">
                                {recipe.RecipeToIngredient.slice(0, 3).map((ingredient, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                                        <span>{ingredient.Ingredient.name}</span>
                                        <span>
                                            {ingredient.quantity} {ingredient.measure.toLowerCase()}
                                        </span>
                                    </div>
                                ))}
                                {recipe.RecipeToIngredient.length > 3 && (
                                    <p className="text-sm text-gray-500">
                                        +{recipe.RecipeToIngredient.length - 3} more ingredients
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Instructions Preview */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions</h4>
                            <div className="space-y-1">
                                {recipe.steps.slice(0, 2).map((step, idx) => (
                                    <div key={idx} className="flex space-x-2 text-sm text-gray-600">
                                        <span className="flex-shrink-0 w-4 h-4 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                                            {idx + 1}
                                        </span>
                                        <span className="line-clamp-2">{step}</span>
                                    </div>
                                ))}
                                {recipe.steps.length > 2 && (
                                    <p className="text-sm text-gray-500">
                                        +{recipe.steps.length - 2} more steps
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MyRecipes;