import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChefHat, Home, Plus, BookOpen, LogOut, LogIn, UserPlus, LucideIcon } from 'lucide-react'
interface LinkObject {
    name: string;
    href: string;
    icon: LucideIcon;
    onClick?: () => void;
}
interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const { user, logout } = useAuth()
    const location = useLocation()

    const navigation: LinkObject[] = [
        { name: 'Home', href: '/', icon: Home },
        ...(user ? [
            { name: 'Generate Recipe', href: '/generate', icon: Plus },
            { name: 'My Recipes', href: '/my-recipes', icon: BookOpen },
        ] : []),
    ]

    const authLinks: LinkObject[] = user ? [
        { name: 'Logout', href: '#', icon: LogOut, onClick: logout },
    ] : [
        { name: 'Login', href: '/login', icon: LogIn },
        { name: 'Register', href: '/register', icon: UserPlus },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Sherbiny Kitchen" className="h-8 w-8" />
                            <span className="text-xl font-bold text-gray-900">Sherbiny Kitchen</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={item.onClick}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.href
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Auth Links */}
                        <div className="flex items-center space-x-4">
                            {authLinks.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={item.onClick}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}

export default Layout 