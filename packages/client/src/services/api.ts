import axios from 'axios'
import {
    UserRegistration,
    UserLogin,
    LoginResponse,
    Ingredient,
    GenerateRecipeRequest,
    GetGeneratedRecipeResponse,
    StoredRecipe,
    GetMyRecipesResponse,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const response = await api.post('/api/v1/auth/token')
                const newToken = response.headers['x-access-token']

                if (newToken) {
                    localStorage.setItem('accessToken', newToken)
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken')
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

// Auth endpoints
export const authAPI = {
    register: async (userData: UserRegistration) => {
        const response = await api.post('/api/v1/auth/register', userData)
        return response.data
    },

    login: async (credentials: UserLogin): Promise<LoginResponse> => {
        const response = await api.post('/api/v1/auth/login', credentials)
        const data = response.data

        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken)
        }

        return data
    },

    logout: async () => {
        await api.get('/api/v1/auth/logout')
        localStorage.removeItem('accessToken')
    },

    verifyEmail: async (token: string) => {
        const response = await api.post(`/api/v1/auth/verify-email?token=${token}`)
        return response.data
    },

    newEmailToken: async (email: string) => {
        const response = await api.post(`/api/v1/auth/new-email-token?email=${email}`)
        return response.data
    },

    forgetPassword: async (email: string) => {
        const response = await api.post('/api/v1/auth/forget-password', { email })
        return response.data
    },

    resetPassword: async (email: string, passwordToken: string, newPassword: string) => {
        const response = await api.post('/api/v1/auth/reset-password', {
            email,
            passwordToken,
            newPassword,
        })
        return response.data
    },
}

// Recipe endpoints
export const recipeAPI = {
    generate: async (data: GenerateRecipeRequest): Promise<GetGeneratedRecipeResponse> => {
        const response = await api.post('/api/v1/recipe/generate', data)
        return response.data
    },

    save: async (recipeKey: string) => {
        const response = await api.post(`/api/v1/recipe/save/${recipeKey}`)
        return response.data
    },

    getRecipe: async (recipeKey: string): Promise<StoredRecipe> => {
        const response = await api.get(`/api/v1/recipe/${recipeKey}`)
        return response.data
    },

    getMyRecipes: async (): Promise<GetMyRecipesResponse> => {
        const response = await api.get('/api/v1/recipe')
        return response.data
    },
}

// Ingredient endpoints
export const ingredientAPI = {
    getAll: async (): Promise<{ count: number; ingredients: Ingredient[] }> => {
        const response = await api.get('/api/v1/ingredient')
        return response.data
    },
}

export default api 