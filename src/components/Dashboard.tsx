import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { moodService, type MoodEntry } from '../services/moodService'
import { MoodChart } from './MoodChart'
import { CalendarHeatmap } from './CalendarHeatmap'
import QuickActions from './QuickActions'
import MoodHistory from './MoodHistory'
import { StatsCards } from './StatsCards'
import { LoadingSpinner } from './LoadingSpinner'
import { ColorfulMoodIndicator, MoodTrendIndicator } from './ColorfulMoodIndicator'
import { IntelligentAnalytics } from './IntelligentAnalytics'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMoodEntries()
  }, [])

  const loadMoodEntries = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await moodService.getMoodEntries()
      
      // Defensive programming: Handle service response format
      if (result.error) {
        throw new Error(result.error.message || 'Failed to load mood entries')
      }
      
      // Ensure we have a valid array
      const entries = Array.isArray(result.data) ? result.data : []
      setMoodEntries(entries)
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to load mood entries')
      // Set empty array on error to prevent crashes
      setMoodEntries([])
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadMoodEntries()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="heading-lg mb-2">Error loading dashboard</h2>
          <p className="text-body mb-6">{error}</p>
          <button 
            onClick={handleRetry}
            className="btn-primary focus-ring"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  
  // Bulletproof defensive programming for all array operations
  const todaysEntry = Array.isArray(moodEntries) && moodEntries.length > 0 
    ? moodEntries.find(entry => entry && entry.date === today) || null
    : null
    
  const recentEntries = Array.isArray(moodEntries) && moodEntries.length > 0 
    ? moodEntries.slice(0, 7).filter(entry => entry != null)
    : []
    
  const averageMood = Array.isArray(moodEntries) && moodEntries.length > 0 
    ? (moodEntries
        .filter(entry => entry && typeof entry.mood_score === 'number')
        .reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length
      ).toFixed(1)
    : '0'

        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 via-cyan-50 via-green-50 to-yellow-50">
            {/* Enhanced Colorful Header */}
            <header className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 via-cyan-500 via-green-500 to-yellow-500 opacity-10"></div>
              <div className="relative glass-card rounded-none border-x-0 border-t-0 shadow-xl">
                <div className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex items-center justify-between">
                    <div className="animate-fade-in">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold animate-pulse">
                          🎭
                        </div>
                        <div>
                          <h1
                            className="heading-xl bg-clip-text text-transparent animate-gradient"
                            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 25%, #06B6D4 50%, #10B981 75%, #F59E0B 100%)' }}
                          >
                            Moody Dashboard
                          </h1>
                          <p className="text-sm text-gray-600 font-medium">
                            Your colorful mood tracking journey 🌈
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 mt-3">
                        <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <p className="text-sm text-gray-700 font-medium">
                            Welcome back, {user?.email?.split('@')[0] || 'User'}! ✨
                          </p>
                        </div>
                        {todaysEntry && (
                          <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full">
                            <span className="text-sm text-gray-600 font-medium">Today's mood:</span>
                            <ColorfulMoodIndicator score={todaysEntry.mood_score} size="sm" showLabel={false} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="animate-scale-in">
                      <Link
                        to="/log-mood"
                        className="btn-primary focus-ring hover:scale-105 transition-transform duration-200 shadow-lg"
                        style={{ 
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)',
                          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(236, 72, 153, 0.3)'
                        }}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Log Mood
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
              {/* Enhanced Colorful Welcome Section */}
              <div className="relative overflow-hidden rounded-3xl p-8 animate-float" 
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 25%, rgba(6, 182, 212, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(245, 158, 11, 0.1) 100%)',
                     border: '1px solid rgba(255, 255, 255, 0.3)',
                     boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1), 0 8px 16px rgba(236, 72, 153, 0.1)'
                   }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-pink-200/20 via-cyan-200/20 via-green-200/20 to-yellow-200/20"></div>
                <div className="relative">
                  <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                        <div className="text-4xl animate-bounce">☀️</div>
                        <h2 className="text-3xl font-bold text-gray-800">
                          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!
                        </h2>
                      </div>
                      <p className="text-lg text-gray-700 mb-6 max-w-2xl">
                        Ready to track your mood and discover insights about your emotional well-being? 
                        Let's make today colorful! 🌈
                      </p>
                      {moodEntries.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                          <div className="px-4 py-2 bg-white/60 rounded-full border border-purple-200">
                            <span className="text-sm text-gray-600 font-medium">Your mood trend:</span>
                            <MoodTrendIndicator
                              trend={averageMood > '3.5' ? 'up' : averageMood < '2.5' ? 'down' : 'stable'}
                              percentage={Math.abs(parseFloat(averageMood) - 3) * 20}
                            />
                          </div>
                          <div className="px-4 py-2 bg-white/60 rounded-full border border-green-200">
                            <span className="text-sm text-gray-600 font-medium">Total entries: </span>
                            <span className="text-purple-600 font-bold">{moodEntries.length}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="hidden md:block">
                        <div 
                          className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 via-cyan-400 via-green-400 to-yellow-400 flex items-center justify-center text-6xl animate-pulse shadow-2xl"
                          style={{ 
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 25%, #06B6D4 50%, #10B981 75%, #F59E0B 100%)',
                            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          🎭
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-2xl animate-bounce">😊</div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: '1s' }}>💫</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Colorful Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Stats and Quick Actions */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Colorful Stats Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">📊</div>
                      <h3 className="text-xl font-bold text-gray-800">Your Stats</h3>
                    </div>
                    <StatsCards
                      totalEntries={moodEntries.length}
                      averageMood={averageMood}
                      currentStreak={calculateStreak(moodEntries)}
                    />
                  </div>

                  {/* Colorful Quick Actions Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">⚡</div>
                      <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
                    </div>
                    <QuickActions />
                  </div>

                  {/* Mood History Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">📝</div>
                      <h3 className="text-xl font-bold text-gray-800">Recent History</h3>
                    </div>
                    <MoodHistory />
                  </div>
                </div>

                {/* Right Column - Charts and Insights */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Enhanced Mood Chart Section */}
                  <div className="animate-slide-up">
                    <div className="relative overflow-hidden rounded-3xl p-6" 
                         style={{ 
                           background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)',
                           border: '1px solid rgba(139, 92, 246, 0.2)',
                           boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)'
                         }}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">📈</div>
                          <div>
                            <h2
                              className="heading-md bg-clip-text text-transparent animate-gradient"
                              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)' }}
                            >
                              Mood Trends
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Track your emotional journey over time</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-purple-200/30">
                          <div className="flex items-center space-x-1">
                            <ColorfulMoodIndicator score={5} size="sm" showLabel={false} />
                            <span className="text-xs text-gray-600 font-medium">Excellent</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ColorfulMoodIndicator score={4} size="sm" showLabel={false} />
                            <span className="text-xs text-gray-600 font-medium">Good</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ColorfulMoodIndicator score={3} size="sm" showLabel={false} />
                            <span className="text-xs text-gray-600 font-medium">Okay</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ColorfulMoodIndicator score={2} size="sm" showLabel={false} />
                            <span className="text-xs text-gray-600 font-medium">Poor</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ColorfulMoodIndicator score={1} size="sm" showLabel={false} />
                            <span className="text-xs text-gray-600 font-medium">Terrible</span>
                          </div>
                        </div>
                      </div>
                      <MoodChart entries={moodEntries} />
                    </div>
                  </div>

                  {/* Enhanced Calendar Section */}
                  <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative overflow-hidden rounded-3xl p-6" 
                         style={{ 
                           background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(245, 158, 11, 0.05) 100%)',
                           border: '1px solid rgba(16, 185, 129, 0.2)',
                           boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)'
                         }}>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-white text-lg font-bold">📅</div>
                        <div>
                          <h2 className="heading-md bg-clip-text text-transparent animate-gradient"
                              style={{ background: 'linear-gradient(135deg, #10B981 0%, #F59E0B 100%)' }}>
                            Mood Calendar
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">Your colorful mood journey</p>
                        </div>
                      </div>
                      <CalendarHeatmap />
                    </div>
                  </div>

                  {/* Enhanced Analytics Section */}
                  <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="relative overflow-hidden rounded-3xl p-6" 
                         style={{ 
                           background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(239, 68, 68, 0.05) 100%)',
                           border: '1px solid rgba(236, 72, 153, 0.2)',
                           boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)'
                         }}>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white text-lg font-bold">🧠</div>
                        <div>
                          <h2 className="heading-md bg-clip-text text-transparent animate-gradient"
                              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #EF4444 100%)' }}>
                            Intelligent Analytics
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">Discover patterns in your emotions</p>
                        </div>
                      </div>
                      <IntelligentAnalytics />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Colorful Recent Entries */}
              {recentEntries.length > 0 && (
                <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="relative overflow-hidden rounded-3xl p-8" 
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(139, 92, 246, 0.05) 25%, rgba(236, 72, 153, 0.05) 50%, rgba(6, 182, 212, 0.05) 75%, rgba(16, 185, 129, 0.05) 100%)',
                         border: '1px solid rgba(139, 92, 246, 0.2)',
                         boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)'
                       }}>
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">📝</div>
                      <div>
                        <h2 className="heading-md bg-clip-text text-transparent animate-gradient"
                            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 25%, #06B6D4 50%, #10B981 75%, #F59E0B 100%)' }}>
                          Recent Mood Entries
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Your latest emotional moments</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentEntries.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="relative overflow-hidden rounded-2xl p-6 border border-white/40 hover:scale-105 transition-all duration-300 group"
                          style={{
                            background: `linear-gradient(135deg, 
                              ${index % 5 === 0 ? 'rgba(139, 92, 246, 0.1)' : 
                                index % 5 === 1 ? 'rgba(236, 72, 153, 0.1)' :
                                index % 5 === 2 ? 'rgba(6, 182, 212, 0.1)' :
                                index % 5 === 3 ? 'rgba(16, 185, 129, 0.1)' :
                                'rgba(245, 158, 11, 0.1)'} 0%, 
                              rgba(255, 255, 255, 0.8) 100%)`,
                            boxShadow: `0 8px 25px ${
                              index % 5 === 0 ? 'rgba(139, 92, 246, 0.15)' : 
                              index % 5 === 1 ? 'rgba(236, 72, 153, 0.15)' :
                              index % 5 === 2 ? 'rgba(6, 182, 212, 0.15)' :
                              index % 5 === 3 ? 'rgba(16, 185, 129, 0.15)' :
                              'rgba(245, 158, 11, 0.15)'
                            }`
                          }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                                {new Date(entry.date).getDate()}
                              </div>
                              <span className="font-semibold text-gray-800 text-sm">
                                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <ColorfulMoodIndicator score={entry.mood_score} size="md" showLabel={false} />
                          </div>
                          
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-gray-800 mb-1">
                              {entry.mood_score}/5
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {entry.mood_score === 5 ? 'Excellent' :
                               entry.mood_score === 4 ? 'Good' :
                               entry.mood_score === 3 ? 'Okay' :
                               entry.mood_score === 2 ? 'Poor' : 'Terrible'}
                            </div>
                          </div>

                           {entry.emotions && Array.isArray(entry.emotions) && entry.emotions.length > 0 && (
                             <div className="flex flex-wrap gap-2 mb-4">
                               {entry.emotions.slice(0, 3).map((emotion, emotionIndex) => (
                                <span
                                  key={emotion}
                                  className="px-3 py-1 text-xs rounded-full font-medium border"
                                  style={{
                                    backgroundColor: emotionIndex === 0 ? 'rgba(139, 92, 246, 0.1)' :
                                                    emotionIndex === 1 ? 'rgba(236, 72, 153, 0.1)' :
                                                    'rgba(6, 182, 212, 0.1)',
                                    borderColor: emotionIndex === 0 ? 'rgba(139, 92, 246, 0.3)' :
                                                emotionIndex === 1 ? 'rgba(236, 72, 153, 0.3)' :
                                                'rgba(6, 182, 212, 0.3)',
                                    color: emotionIndex === 0 ? '#8B5CF6' :
                                           emotionIndex === 1 ? '#EC4899' :
                                           '#06B6D4'
                                  }}
                                >
                                  {emotion}
                                </span>
                              ))}
                            </div>
                          )}

                          {entry.journal_entry && (
                            <div className="bg-white/60 rounded-xl p-3 border border-white/40">
                              <p className="text-sm text-gray-700 line-clamp-3 italic">
                                "{entry.journal_entry}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
      </main>
    </div>
  )
}

// Helper function to calculate mood streak with defensive programming
function calculateStreak(entries: MoodEntry[]): number {
  // Defensive programming: Ensure entries is valid array
  if (!Array.isArray(entries) || entries.length === 0) return 0
  
  // Filter out invalid entries and sort safely
  const validEntries = entries
    .filter(entry => entry && entry.date && typeof entry.date === 'string')
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA // Sort descending (newest first)
    })
  
  if (validEntries.length === 0) return 0
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = new Date(today)
  
  for (const entry of validEntries) {
    try {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (entryDate.getTime() < currentDate.getTime()) {
        break
      }
    } catch (error) {
      // Skip invalid date entries
      console.warn('Invalid date in mood entry:', entry.date)
      continue
    }
  }
  
  return streak
}