import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authAPI } from '../services/api'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface ForgetPasswordForm {
    email: string
}

interface ResetPasswordForm {
    email: string
    passwordToken: string
    newPassword: string
    confirmPassword: string
}

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const token = searchParams.get('token')
    const email = searchParams.get('email')

    const {
        register: registerForget,
        handleSubmit: handleSubmitForget,
        formState: { errors: errorsForget },
    } = useForm<ForgetPasswordForm>()

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        watch,
        formState: { errors: errorsReset },
    } = useForm<ResetPasswordForm>({
        defaultValues: {
            email: email || '',
            passwordToken: token || '',
        },
    })

    const newPassword = watch('newPassword')

    const handleForgetPassword = async (data: ForgetPasswordForm) => {
        setIsLoading(true)
        try {
            await authAPI.forgetPassword(data.email)
            setEmailSent(true)
            toast.success('Password reset email sent! Check your inbox.')
        } catch (error) {
            toast.error('Failed to send reset email. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (data: ResetPasswordForm) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setIsLoading(true)
        try {
            await authAPI.resetPassword(data.email, data.passwordToken, data.newPassword)
            toast.success('Password reset successfully! You can now login with your new password.')
            navigate('/login')
        } catch (error) {
            toast.error('Failed to reset password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // If we have a token, show the reset password form
    if (token && email) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="card w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                        <p className="mt-2 text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...registerReset('email', {
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
                                    readOnly
                                />
                            </div>
                            {errorsReset.email && (
                                <p className="mt-1 text-sm text-red-600">{errorsReset.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...registerReset('newPassword', {
                                        required: 'New password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    className="input-field pl-10 pr-10"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errorsReset.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errorsReset.newPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...registerReset('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === newPassword || 'Passwords do not match',
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className="input-field pl-10 pr-10"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errorsReset.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errorsReset.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="text-center">
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Show forget password form
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="card w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="mt-2 text-gray-600">
                        {emailSent
                            ? 'Check your email for reset instructions'
                            : 'Enter your email to receive reset instructions'
                        }
                    </p>
                </div>

                {!emailSent ? (
                    <form onSubmit={handleSubmitForget(handleForgetPassword)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...registerForget('email', {
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
                            {errorsForget.email && (
                                <p className="mt-1 text-sm text-red-600">{errorsForget.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Email'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800">
                                We've sent a password reset link to your email address.
                                Please check your inbox and follow the instructions.
                            </p>
                        </div>
                        <button
                            onClick={() => setEmailSent(false)}
                            className="btn-secondary"
                        >
                            Send Another Email
                        </button>
                    </div>
                )}

                <div className="text-center">
                    <Link to="/login" className="flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700 font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword 