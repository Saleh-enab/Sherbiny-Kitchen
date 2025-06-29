import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import { StoredRecipe } from '../types';
import { Clock, Globe, ArrowLeft, Bookmark, BookmarkPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const RecipeDetails = () => {
    const { recipeKey } = useParams<{ recipeKey: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<StoredRecipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // Optionally connect to backend later

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeKey) return;

            try {
                const recipeData = await recipeAPI.getRecipe(recipeKey);
                if (!recipeData || !recipeData.name || !Array.isArray(recipeData.steps)) {
                    throw new Error('Invalid recipe data');
                }

                setRecipe(recipeData);
                setIsSaved(false); // You can check saved status via API later
            } catch (error) {
                toast.error('Failed to load recipe');
                navigate('/my-recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeKey, navigate]);

    const handleSaveRecipe = async () => {
        if (!recipeKey) return;

        setSaving(true);
        try {
            await recipeAPI.save(recipeKey);
            setIsSaved(true);
            toast.success('Recipe saved successfully!');
        } catch (error) {
            toast.error('Failed to save recipe');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Recipe not found</h2>
                <p className="text-gray-600">The recipe you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/my-recipes')}
                    className="btn-primary"
                >
                    Back to My Recipes
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/my-recipes')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to My Recipes</span>
                </button>

                <button
                    onClick={handleSaveRecipe}
                    disabled={saving || isSaved}
                    className="flex items-center space-x-2 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                        </>
                    ) : isSaved ? (
                        <>
                            <Bookmark className="h-5 w-5" />
                            <span>Saved</span>
                        </>
                    ) : (
                        <>
                            <BookmarkPlus className="h-5 w-5" />
                            <span>Save Recipe</span>
                        </>
                    )}
                </button>
            </div>

            {/* Title & Meta */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">{recipe.name}</h1>
                <div className="flex items-center justify-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>{recipe.timeInMinutes} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>{recipe.country}</span>
                    </div>
                </div>
            </div>

            {/* Ingredients */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {recipe.RecipeToIngredient.map((ingredient, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                            <span className="font-medium text-gray-900">
                                {ingredient.Ingredient.name}
                            </span>
                            <span className="text-gray-600">
                                {ingredient.quantity} {ingredient.measure.toLowerCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
                <div className="space-y-6">
                    {recipe.steps.map((step, index) => (
                        <div key={index} className="flex space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed">{step}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
