import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Home, 
  Calendar, 
  BarChart3, 
  PlusCircle, 
  User, 
  LogOut, 
  Menu, 
  X,
  Brain
} from 'lucide-react'

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/log-mood', label: 'Log Mood', icon: PlusCircle },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <nav className="cyber-nav">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Cyberpunk Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-full flex items-center justify-center group-hover:shadow-cyber-glow transition-all duration-300">
                <Brain className="w-6 h-6 text-cyber-bg" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-secondary rounded-full animate-cyber-pulse"></div>
            </div>
            <div>
              <span className="cyber-text text-2xl font-bold font-mono">MOODY</span>
              <p className="text-cyber-text-muted text-xs -mt-1">Neural Interface</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`cyber-nav-item flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-cyber-text-muted">
              <User className="h-4 w-4" />
              <span className="font-mono">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="cyber-btn-secondary flex items-center space-x-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="cyber-btn-secondary p-2 hover:scale-105 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyber-border">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`cyber-nav-item flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive ? 'active' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="border-t border-cyber-border pt-4 mt-4">
                <div className="flex items-center space-x-3 px-4 py-3 text-sm text-cyber-text-muted">
                  <User className="h-5 w-5" />
                  <span className="font-mono">{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="cyber-btn-secondary flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}