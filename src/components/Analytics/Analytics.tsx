import React, { useEffect, useState } from 'react'
import { subDays, subMonths } from 'date-fns'
import { useMood } from '../../contexts/MoodContext'
import { BarChart3, TrendingUp, Calendar, Activity, Smile, Brain } from 'lucide-react'
import { MoodTrendChart } from './MoodTrendChart'
import { EmotionAnalysis } from './EmotionAnalysis'
import { ActivityCorrelation } from './ActivityCorrelation'
import { AIAssistant } from '../AIAssistant/AIAssistant'

export const Analytics: React.FC = () => {
  const { moodEntries, loading, fetchMoodEntries } = useMood()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    fetchMoodEntries()
  }, [fetchMoodEntries])

  // Filter entries based on time range
  const getFilteredEntries = () => {
    const endDate = new Date()
    let startDate: Date

    switch (timeRange) {
      case '7d':
        startDate = subDays(new Date(), 7)
        break
      case '30d':
        startDate = subDays(new Date(), 30)
        break
      case '90d':
        startDate = subDays(new Date(), 90)
        break
      case '1y':
        startDate = subMonths(new Date(), 12)
        break
    }

    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= startDate && entryDate <= endDate
    })
  }

  const entries = getFilteredEntries()

  const calculateAverageMood = () => {
    if (entries.length === 0) return 0
    return entries.reduce((sum, entry) => sum + entry.mood_score, 0) / entries.length
  }

  const getMoodTrend = () => {
    if (entries.length < 2) return 'stable'
    
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const firstHalf = sortedEntries.slice(0, Math.floor(sortedEntries.length / 2))
    const secondHalf = sortedEntries.slice(Math.floor(sortedEntries.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood_score, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood_score, 0) / secondHalf.length
    
    if (secondAvg > firstAvg + 0.2) return 'improving'
    if (secondAvg < firstAvg - 0.2) return 'declining'
    return 'stable'
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 Days'
      case '30d': return 'Last 30 Days'
      case '90d': return 'Last 90 Days'
      case '1y': return 'Last Year'
    }
  }

  if (loading) {
    return (
      <div className="cyber-dashboard flex items-center justify-center min-h-64">
        <div className="cyber-card p-8 text-center">
          <div className="cyber-spinner mx-auto mb-4"></div>
          <p className="text-cyber-text-muted">Analyzing neural patterns...</p>
        </div>
      </div>
    )
  }

  const averageMood = calculateAverageMood()
  const moodTrend = getMoodTrend()

  return (
    <div className="cyber-dashboard py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cyberpunk Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-10 w-10 text-cyber-primary" />
            <div>
              <h1 className="cyber-text text-4xl font-bold">Neural Analytics</h1>
              <p className="text-cyber-text-muted text-sm mt-1">Advanced insights into your neural patterns and trends</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-cyber-accent" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="cyber-select"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="cyber-card text-center py-16">
            <div className="relative mb-8">
              <BarChart3 className="h-16 w-16 text-cyber-border mx-auto mb-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-cyber-primary animate-cyber-pulse" />
              </div>
            </div>
            <h3 className="cyber-text text-2xl font-bold mb-4">No neural data available</h3>
            <p className="text-cyber-text-muted mb-6 max-w-md mx-auto">
              No mood entries found for {getTimeRangeLabel().toLowerCase()}. Start tracking your neural patterns to see analytics.
            </p>
            <a href="/log-mood" className="cyber-btn-primary">
              <Brain className="w-5 h-5 mr-2" />
              Log Neural Pattern
            </a>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="cyber-stat-card">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-8 w-8 text-cyber-primary mr-3" />
                  <div>
                    <p className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Average Mood</p>
                    <p className="cyber-text text-3xl font-bold font-mono">{averageMood.toFixed(1)}</p>
                    <p className="text-cyber-text-muted text-xs">{getTimeRangeLabel()}</p>
                  </div>
                </div>
                <div className="cyber-progress h-2">
                  <div 
                    className="cyber-progress-bar" 
                    style={{ width: `${(averageMood / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="cyber-stat-card">
                <div className="flex items-center mb-4">
                  <TrendingUp className={`h-8 w-8 mr-3 ${
                    moodTrend === 'improving' ? 'text-cyber-primary' :
                    moodTrend === 'declining' ? 'text-cyber-secondary' :
                    'text-cyber-accent'
                  }`} />
                  <div>
                    <p className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Trend</p>
                    <p className="cyber-text text-3xl font-bold font-mono capitalize">{moodTrend}</p>
                    <p className="text-cyber-text-muted text-xs">Overall direction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    moodTrend === 'improving' ? 'bg-cyber-primary' :
                    moodTrend === 'declining' ? 'bg-cyber-secondary' :
                    'bg-cyber-accent'
                  } animate-cyber-pulse`}></div>
                  <span className="text-cyber-text-muted text-xs">Neural trajectory</span>
                </div>
              </div>

              <div className="cyber-stat-card">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-cyber-accent mr-3" />
                  <div>
                    <p className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Total Entries</p>
                    <p className="cyber-text text-3xl font-bold font-mono">{entries.length}</p>
                    <p className="text-cyber-text-muted text-xs">{getTimeRangeLabel()}</p>
                  </div>
                </div>
                <div className="cyber-progress h-2">
                  <div 
                    className="cyber-progress-bar" 
                    style={{ width: `${Math.min(100, (entries.length / 30) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Mood Trend Over Time */}
              <div className="cyber-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-cyber-primary" />
                  <h3 className="cyber-text text-xl font-bold">Neural Trend Analysis</h3>
                </div>
                <MoodTrendChart entries={entries} />
              </div>

              {/* Emotion Analysis */}
              <div className="cyber-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Smile className="h-6 w-6 text-cyber-accent" />
                  <h3 className="cyber-text text-xl font-bold">Emotion Patterns</h3>
                </div>
                <EmotionAnalysis entries={entries} />
              </div>
            </div>

            {/* Activity Correlation */}
            <div className="cyber-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="h-6 w-6 text-cyber-secondary" />
                <h3 className="cyber-text text-xl font-bold">Activity Impact on Neural Patterns</h3>
              </div>
              <ActivityCorrelation entries={entries} />
            </div>
          </>
        )}
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}