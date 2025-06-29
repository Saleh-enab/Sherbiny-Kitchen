import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { recipeAPI, ingredientAPI } from '../services/api'
import { Ingredient, GenerateRecipeRequest, GeneratedRecipe } from '../types'
import { Plus, Trash2, Save, X, Clock, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

interface IngredientFormData {
    ingredients: Array<{
        name: string
        quantity: number
        measure: 'PIECE' | 'PACKET' | 'GRAM' | 'KILOGRAM' | 'SPOON' | 'CUP'
    }>
    options: string[]
    country: string
    dishType: 'MAIN' | 'DESSERT' | 'APPETIZER' | 'SNACK'
}

const RecipeGenerator = () => {
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
    const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)
    const [recipeKey, setRecipeKey] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IngredientFormData>({
        defaultValues: {
            ingredients: [{ name: '', quantity: 1, measure: 'GRAM' }],
            options: [],
            country: '',
            dishType: 'MAIN',
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients',
    })

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await ingredientAPI.getAll()
                setAvailableIngredients(response.ingredients)
            } catch (error) {
                toast.error('Failed to load ingredients')
            }
        }
        fetchIngredients()
    }, [])

    const onSubmit = async (data: IngredientFormData) => {
        setIsGenerating(true)
        setGeneratedRecipe(null)
        setRecipeKey(null)

        try {
            const requestData: GenerateRecipeRequest = {
                ingredients: data.ingredients.filter(ing => ing.name && ing.quantity > 0),
                options: data.options,
                country: data.country,
                dishType: data.dishType,
            }

            const response = await recipeAPI.generate(requestData)
            setGeneratedRecipe(response.finalResult)
            setRecipeKey(response.recipeKey)
            setRemainingAttempts(response.remainingAttemps)
            toast.success('Recipe generated successfully!')
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to generate recipe'
            toast.error(message)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSaveRecipe = async () => {
        if (!recipeKey) return

        setIsSaving(true)
        try {
            await recipeAPI.save(recipeKey)
            toast.success('Recipe saved successfully!')
            setGeneratedRecipe(null)
            setRecipeKey(null)
            reset()
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to save recipe'
            toast.error(message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleIgnoreRecipe = () => {
        setGeneratedRecipe(null)
        setRecipeKey(null)
        reset()
        toast.success('Recipe ignored. You can generate a new one!')
    }

    const measurementUnits = [
        { value: 'PIECE', label: 'Piece' },
        { value: 'PACKET', label: 'Packet' },
        { value: 'GRAM', label: 'Gram' },
        { value: 'KILOGRAM', label: 'Kilogram' },
        { value: 'SPOON', label: 'Spoon' },
        { value: 'CUP', label: 'Cup' },
    ]

    const dishTypes = [
        { value: 'MAIN', label: 'Main Course' },
        { value: 'DESSERT', label: 'Dessert' },
        { value: 'APPETIZER', label: 'Appetizer' },
        { value: 'SNACK', label: 'Snack' },
    ]

    const cuisineOptions = [
        'Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Thai', 'French', 'Mediterranean',
        'American', 'Greek', 'Spanish', 'Korean', 'Vietnamese', 'Lebanese', 'Turkish', 'Moroccan'
    ]

    const preferenceOptions = [
        'spicy', 'quick', 'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein'
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Generate Your Recipe</h1>
                <p className="mt-2 text-gray-600">
                    Select your ingredients and preferences to create a unique recipe
                </p>
                {remainingAttempts !== null && (
                    <p className="mt-2 text-sm text-gray-500">
                        Remaining attempts today: {remainingAttempts}
                    </p>
                )}
            </div>

            {!generatedRecipe ? (
                <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
                    {/* Ingredients Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2">
                                        <select
                                            {...register(`ingredients.${index}.name` as const, {
                                                required: 'Please select an ingredient',
                                            })}
                                            className="input-field"
                                        >
                                            <option value="">Select ingredient</option>
                                            {availableIngredients.map((ingredient) => (
                                                <option key={ingredient.slug} value={ingredient.name}>
                                                    {ingredient.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ingredients?.[index]?.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.ingredients[index]?.name?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            {...register(`ingredients.${index}.quantity` as const, {
                                                required: 'Quantity is required',
                                                min: { value: 0.1, message: 'Quantity must be greater than 0' },
                                            })}
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            className="input-field"
                                            placeholder="Quantity"
                                        />
                                        {errors.ingredients?.[index]?.quantity && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.ingredients[index]?.quantity?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <select
                                            {...register(`ingredients.${index}.measure` as const)}
                                            className="input-field"
                                        >
                                            {measurementUnits.map((unit) => (
                                                <option key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </option>
                                            ))}
                                        </select>

                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => append({ name: '', quantity: 1, measure: 'GRAM' })}
                                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add another ingredient</span>
                            </button>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cuisine Style
                                </label>
                                <select
                                    {...register('country', { required: 'Please select a cuisine style' })}
                                    className="input-field"
                                >
                                    <option value="">Select cuisine</option>
                                    {cuisineOptions.map((cuisine) => (
                                        <option key={cuisine} value={cuisine}>
                                            {cuisine}
                                        </option>
                                    ))}
                                </select>
                                {errors.country && (
                                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dish Type
                                </label>
                                <select
                                    {...register('dishType')}
                                    className="input-field"
                                >
                                    {dishTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Options (Optional)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {preferenceOptions.map((option) => (
                                    <label key={option} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={option}
                                            {...register('options')}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? 'Generating Recipe...' : 'Generate Recipe'}
                    </button>
                </form>
            ) : (
                <div className="card space-y-6">
                    {/* Recipe Header */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">{generatedRecipe.recipeName}</h2>
                        <div className="flex justify-center items-center space-x-6 mt-4 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5" />
                                <span>{generatedRecipe.timeInMinutes} minutes</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Globe className="h-5 w-5" />
                                <span>{generatedRecipe.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {generatedRecipe.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="font-medium">{ingredient.name}</span>
                                    <span className="text-gray-600">
                                        {ingredient.quantity} {ingredient.measure.toLowerCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                        <ol className="space-y-3">
                            {generatedRecipe.steps.map((step, index) => (
                                <li key={index} className="flex space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleSaveRecipe}
                            disabled={isSaving}
                            className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
                        >
                            <Save className="h-5 w-5" />
                            <span>{isSaving ? 'Saving...' : 'Save Recipe'}</span>
                        </button>
                        <button
                            onClick={handleIgnoreRecipe}
                            className="btn-secondary flex-1 flex items-center justify-center space-x-2 py-3"
                        >
                            <X className="h-5 w-5" />
                            <span>Ignore Recipe</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecipeGenerator 