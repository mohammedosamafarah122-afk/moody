import React, { useEffect, useState } from 'react'
import { format, subDays, subMonths } from 'date-fns'
import { MoodService, type MoodEntry } from '../../services/moodService'
import { BarChart3, TrendingUp, Calendar, Activity, Smile } from 'lucide-react'
import { MoodTrendChart } from './MoodTrendChart'
import { EmotionAnalysis } from './EmotionAnalysis'
import { ActivityCorrelation } from './ActivityCorrelation'

export const Analytics: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    setError('')

    try {
      const endDate = format(new Date(), 'yyyy-MM-dd')
      let startDate: string

      switch (timeRange) {
        case '7d':
          startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd')
          break
        case '30d':
          startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')
          break
        case '90d':
          startDate = format(subDays(new Date(), 90), 'yyyy-MM-dd')
          break
        case '1y':
          startDate = format(subMonths(new Date(), 12), 'yyyy-MM-dd')
          break
      }

      const { data, error } = await MoodService.getMoodEntriesInRange(startDate, endDate)

      if (error) {
        setError(error.message)
      } else {
        setEntries(data || [])
      }
    } catch (err) {
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

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
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <p>Error loading analytics: {error}</p>
          <button 
            onClick={loadAnalyticsData}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const averageMood = calculateAverageMood()
  const moodTrend = getMoodTrend()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Insights into your mood patterns and trends</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="input-field py-1 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="card text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-600 mb-4">
            No mood entries found for {getTimeRangeLabel().toLowerCase()}
          </p>
          <a href="/log-mood" className="btn-primary">
            Log Your Mood
          </a>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Mood</p>
                  <p className="text-2xl font-bold text-gray-900">{averageMood.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">{getTimeRangeLabel()}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${
                  moodTrend === 'improving' ? 'bg-green-50 text-green-600' :
                  moodTrend === 'declining' ? 'bg-red-50 text-red-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Trend</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{moodTrend}</p>
                  <p className="text-sm text-gray-500">Overall direction</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
                  <p className="text-sm text-gray-500">{getTimeRangeLabel()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Trend Over Time */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Mood Trend</h3>
              </div>
              <MoodTrendChart entries={entries} />
            </div>

            {/* Emotion Analysis */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Smile className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Emotion Patterns</h3>
              </div>
              <EmotionAnalysis entries={entries} />
            </div>
          </div>

          {/* Activity Correlation */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Activity Impact on Mood</h3>
            </div>
            <ActivityCorrelation entries={entries} />
          </div>
        </>
      )}
    </div>
  )
}
