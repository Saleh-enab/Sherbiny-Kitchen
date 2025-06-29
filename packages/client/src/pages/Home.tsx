import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChefHat, Sparkles, BookOpen, Users } from 'lucide-react'

const Home = () => {
    const { user } = useAuth()

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Recipes',
            description: 'Generate unique recipes using artificial intelligence based on your available ingredients.',
        },
        {
            icon: BookOpen,
            title: 'Recipe Collection',
            description: 'Save and organize your favorite recipes in your personal collection.',
        },
        {
            icon: Users,
            title: 'User-Friendly',
            description: 'Simple and intuitive interface designed for home cooks of all skill levels.',
        },
    ]

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-8">
                <div className="flex justify-center">
                    <img src="/logo.png" alt="Sherbiny Kitchen" className="h-24 w-24" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                    Welcome to{' '}
                    <span className="text-primary-600">Sherbiny Kitchen</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover the magic of AI-powered recipe generation. Transform your available ingredients
                    into delicious, personalized recipes in seconds.
                </p>

                {user ? (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/generate"
                            className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                        >
                            <ChefHat className="h-5 w-5" />
                            <span>Generate Recipe</span>
                        </Link>
                        <Link
                            to="/my-recipes"
                            className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                        >
                            <BookOpen className="h-5 w-5" />
                            <span>My Recipes</span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="btn-primary text-lg px-8 py-3"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="btn-secondary text-lg px-8 py-3"
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                        <div key={index} className="card text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-3 bg-primary-100 rounded-full">
                                    <Icon className="h-8 w-8 text-primary-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    )
                })}
            </div>

            {/* How It Works */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                            1
                        </div>
                        <h3 className="text-lg font-semibold">Select Ingredients</h3>
                        <p className="text-gray-600">Choose from our extensive list of available ingredients and specify quantities.</p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                            2
                        </div>
                        <h3 className="text-lg font-semibold">Generate Recipe</h3>
                        <p className="text-gray-600">Our AI creates a unique recipe based on your ingredients and preferences.</p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                            3
                        </div>
                        <h3 className="text-lg font-semibold">Save & Cook</h3>
                        <p className="text-gray-600">Save your favorite recipes to your collection and start cooking!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home 