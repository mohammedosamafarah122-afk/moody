import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, Brain, Zap, Shield, Cpu } from 'lucide-react'

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
    <div className="cyber-dashboard min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Cyberpunk Background Grid */}
      <div className="cyber-grid absolute inset-0 opacity-20"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Main Cyberpunk Card */}
        <div className="cyber-card p-8 rounded-3xl shadow-2xl border border-cyber-border relative overflow-hidden">
          {/* Animated Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyber-primary via-cyber-accent to-cyber-secondary opacity-20 animate-cyber-pulse"></div>
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-full flex items-center justify-center mb-4 shadow-cyber-glow animate-cyber-float">
              <Brain className="h-10 w-10 text-cyber-bg" />
            </div>
            <h1 className="cyber-heading text-3xl font-bold mb-2">
              {mode === 'signin' ? 'NEURAL LINK ACTIVATED' : 'WELCOME TO MOOD MATRIX'}
            </h1>
            <p className="text-cyber-text-muted text-sm">
              {mode === 'signin' 
                ? 'Reconnecting to neural interface...' 
                : 'Initialize your neural pattern database'}
            </p>
            <div className="cyber-divider mt-4"></div>
          </div>

          {/* Form */}
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="cyber-label block mb-3">
                  <Cpu className="inline w-4 h-4 mr-2 text-cyber-accent" />
                  Neural ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-accent" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="neural@pattern.matrix"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="cyber-label block mb-3">
                  <Shield className="inline w-4 h-4 mr-2 text-cyber-primary" />
                  Access Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-primary" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                    className="cyber-input w-full pl-10 pr-12 py-3"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-text-muted hover:text-cyber-primary transition-colors"
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
              <div className="cyber-alert cyber-alert-error px-4 py-3 rounded-xl text-sm flex items-center">
                <div className="w-2 h-2 bg-cyber-secondary rounded-full mr-2 animate-cyber-pulse"></div>
                <span className="text-cyber-text">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="cyber-btn-primary w-full py-4 px-6 text-lg font-bold flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="cyber-spinner w-5 h-5 mr-3"></div>
                    <span className="font-mono">
                      {mode === 'signin' ? 'ESTABLISHING LINK...' : 'INITIALIZING DATABASE...'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-3" />
                    <span className="font-mono uppercase tracking-wider">
                      {mode === 'signin' ? 'CONNECT TO MATRIX' : 'JOIN THE MATRIX'}
                    </span>
                    <Zap className="h-5 w-5 ml-3" />
                  </div>
                )}
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center pt-4">
              <div className="cyber-divider mb-4"></div>
              <button
                type="button"
                className="text-cyber-text-muted hover:text-cyber-primary text-sm font-medium transition-colors font-mono"
                onClick={onToggleMode}
              >
                {mode === 'signin' 
                  ? "NEURAL ID NOT FOUND? INITIALIZE NEW CONNECTION" 
                  : 'ALREADY CONNECTED? RESTORE NEURAL LINK'}
              </button>
            </div>
          </form>
        </div>

        {/* Cyberpunk Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-cyber-text-muted text-xs mb-4 font-mono">
            NEURAL PATTERN ANALYSIS • EMOTION TRACKING • MATRIX INSIGHTS
          </p>
          <div className="flex justify-center space-x-6 text-xs text-cyber-text-muted font-mono">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-cyber-pulse"></div>
              ENCRYPTED
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-cyber-accent rounded-full mr-2 animate-cyber-pulse"></div>
              SECURE
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-cyber-secondary rounded-full mr-2 animate-cyber-pulse"></div>
              FREE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
