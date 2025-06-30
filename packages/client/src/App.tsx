import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecipeGenerator from './pages/RecipeGenerator'
import MyRecipes from './pages/MyRecipes'
import ProtectedRoute from './components/ProtectedRoute'
import RecipeDetails from './pages/RecipeDetails'

function App() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/generate"
                        element={
                            <ProtectedRoute>
                                <RecipeGenerator />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-recipes"
                        element={
                            <ProtectedRoute>
                                <MyRecipes />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/recipes/:recipeKey" element={<RecipeDetails />} />
                </Routes>
            </Layout>
        </AuthProvider>
    )
}

export default App 