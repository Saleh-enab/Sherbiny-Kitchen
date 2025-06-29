import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'
import { User, UserRegistration, AuthContextType } from '../types'
import toast from 'react-hot-toast'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('accessToken')
        if (token) {
            // You could verify the token here if needed
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login({ email, password })

            // For now, we'll create a basic user object
            // In a real app, you might want to decode the JWT or make a user profile call
            const userData: User = {
                id: 'temp-id',
                name: email.split('@')[0], // Temporary name from email
                email,
                verified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            setUser(userData)
            toast.success('Login successful!')
        } catch (error: any) {
            const message = error.response?.data?.error || 'Login failed'
            toast.error(message)
            throw error
        }
    }

    const register = async (userData: UserRegistration) => {
        try {
            await authAPI.register(userData)
            toast.success('Registration successful! Please check your email to verify your account.')
        } catch (error: any) {
            const message = error.response?.data?.error || 'Registration failed'
            toast.error(message)
            throw error
        }
    }

    const logout = () => {
        authAPI.logout().catch(console.error)
        setUser(null)
        localStorage.removeItem('accessToken')
        toast.success('Logged out successfully')
    }

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        loading,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 