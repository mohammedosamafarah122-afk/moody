import React from 'react'
import type { MoodEntry } from '../../contexts/MoodContext'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ActivityCorrelationProps {
  entries: MoodEntry[]
}

export const ActivityCorrelation: React.FC<ActivityCorrelationProps> = ({ entries }) => {
  // Calculate activity-mood correlations
  const activityCounts = entries.reduce((acc, entry) => {
    if (entry.activities) {
      entry.activities.forEach((activity: string) => {
        if (!acc[activity]) {
          acc[activity] = { totalMood: 0, count: 0 }
        }
        acc[activity].totalMood += entry.mood_score
        acc[activity].count += 1
      })
    }
    return acc
  }, {} as Record<string, { totalMood: number; count: number }>)

  // Calculate average mood for each activity
  const activityCorrelations = Object.entries(activityCounts)
    .map(([activity, data]) => ({
      activity,
      avgMood: (data as { totalMood: number; count: number }).totalMood / (data as { totalMood: number; count: number }).count,
      count: (data as { totalMood: number; count: number }).count
    }))
    .filter(item => item.count >= 2) // Only show activities with at least 2 occurrences
    .sort((a, b) => b.avgMood - a.avgMood)

  // Calculate overall average mood for comparison
  const overallAvgMood = entries.length > 0 
    ? entries.reduce((sum, entry) => sum + entry.mood_score, 0) / entries.length 
    : 0

  const getMoodColor = (avgMood: number) => {
    if (avgMood >= 4.5) return 'bg-purple-100 text-purple-800 border-purple-200'
    if (avgMood >= 3.5) return 'bg-green-100 text-green-800 border-green-200'
    if (avgMood >= 2.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (avgMood >= 1.5) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getImpactIcon = (avgMood: number) => {
    const diff = avgMood - overallAvgMood
    if (diff > 0.3) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (diff < -0.3) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getImpactText = (avgMood: number) => {
    const diff = avgMood - overallAvgMood
    if (diff > 0.3) return 'Positive impact'
    if (diff < -0.3) return 'Negative impact'
    return 'Neutral impact'
  }

  const getImpactColor = (avgMood: number) => {
    const diff = avgMood - overallAvgMood
    if (diff > 0.3) return 'text-green-600'
    if (diff < -0.3) return 'text-red-600'
    return 'text-gray-500'
  }

  if (activityCorrelations.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No activity data available for correlation analysis
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Activities ranked by their impact on your mood (minimum 2 occurrences)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activityCorrelations.map(({ activity, avgMood, count }) => (
          <div 
            key={activity} 
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-sm ${getMoodColor(avgMood)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{activity}</h4>
              {getImpactIcon(avgMood)}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-80">Average Mood</span>
                <span className="font-bold text-sm">{avgMood.toFixed(1)}/5</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-80">Frequency</span>
                <span className="text-sm">{count} times</span>
              </div>
              
              <div className={`text-xs font-medium ${getImpactColor(avgMood)}`}>
                {getImpactText(avgMood)}
              </div>
            </div>

            {/* Mood bar visualization */}
            <div className="mt-3">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                  className="bg-current h-2 rounded-full transition-all duration-300 opacity-60"
                  style={{ width: `${(avgMood / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
        <div className="space-y-1 text-sm text-gray-600">
          {activityCorrelations.length > 0 && (
            <>
              <p>
                <span className="font-medium text-green-700">
                  {activityCorrelations[0].activity}
                </span>{' '}
                has the highest positive impact on your mood ({activityCorrelations[0].avgMood.toFixed(1)}/5)
              </p>
              
              {activityCorrelations.length > 1 && (
                <p>
                  <span className="font-medium text-red-700">
                    {activityCorrelations[activityCorrelations.length - 1].activity}
                  </span>{' '}
                  shows the lowest mood correlation ({activityCorrelations[activityCorrelations.length - 1].avgMood.toFixed(1)}/5)
                </p>
              )}
              
              <p className="text-xs mt-2 opacity-75">
                Your overall average mood is {overallAvgMood.toFixed(1)}/5
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
