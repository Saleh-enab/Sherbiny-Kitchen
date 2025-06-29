import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { UserLogin } from '../types'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserLogin>()

    const onSubmit = async (data: UserLogin) => {
        setIsLoading(true)
        try {
            await login(data.email, data.password)
            navigate('/generate')
        } catch (error) {
            // Error is handled in the auth context
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="card w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                    <p className="mt-2 text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                type="email"
                                id="email"
                                className="input-field pl-10"
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="input-field pl-10 pr-10"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login 