import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, Heart, Sparkles } from 'lucide-react'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (error) {
        setError(error.message)
      } else if (mode === 'signup') {
        setError('Please check your email for a confirmation link.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
         style={{ 
           background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #f0f9ff 50%, #f0fdf4 75%, #fefce8 100%)' 
         }}>
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {mode === 'signin' ? 'Welcome back!' : 'Welcome to Moody!'}
            </h1>
            <p className="text-gray-600 text-sm">
              {mode === 'signin' 
                ? 'Continue your mood tracking journey' 
                : 'Start tracking your emotions and well-being'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </div>
                )}
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors"
                onClick={onToggleMode}
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs mb-4">Track your mood • Analyze patterns • Export reports</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Secure
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Private
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Free
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
