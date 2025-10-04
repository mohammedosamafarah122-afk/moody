import React from 'react'
import type { MoodEntry } from '../../contexts/MoodContext'
import { TrendingUp, TrendingDown, Minus, Activity, Target, Zap } from 'lucide-react'

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
    if (avgMood >= 4.5) return 'bg-cyber-primary bg-opacity-20 text-cyber-primary border-cyber-primary'
    if (avgMood >= 3.5) return 'bg-cyber-accent bg-opacity-20 text-cyber-accent border-cyber-accent'
    if (avgMood >= 2.5) return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500'
    if (avgMood >= 1.5) return 'bg-orange-500 bg-opacity-20 text-orange-400 border-orange-500'
    return 'bg-red-500 bg-opacity-20 text-red-400 border-red-500'
  }

  const getImpactIcon = (avgMood: number) => {
    const diff = avgMood - overallAvgMood
    if (diff > 0.3) return <TrendingUp className="h-4 w-4 text-cyber-primary" />
    if (diff < -0.3) return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Minus className="h-4 w-4 text-cyber-text-muted" />
  }

  const getImpactText = (avgMood: number) => {
    const diff = avgMood - overallAvgMood
    if (diff > 0.3) return 'Positive impact'
    if (diff < -0.3) return 'Negative impact'
    return 'Neutral impact'
  }

  const getImpactColor = (avgMood: number) => {
    const diff = avgMood - overallAvgMood
    if (diff > 0.3) return 'text-cyber-primary'
    if (diff < -0.3) return 'text-red-400'
    return 'text-cyber-text-muted'
  }

  if (activityCorrelations.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-cyber-text-muted">
        <Activity className="w-12 h-12 mb-4 text-cyber-border" />
        <p className="text-lg font-medium">No activity data available</p>
        <p className="text-sm mt-2">Start logging moods with activity patterns to see correlations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-cyber-accent" />
        <h3 className="cyber-text text-xl font-bold">Activity Pattern Analysis</h3>
      </div>

      <div className="cyber-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-cyber-primary" />
          <h4 className="cyber-label">Activities ranked by mood impact</h4>
        </div>
        <p className="text-cyber-text-muted text-sm mb-6">
          Activities ranked by their impact on your mood (minimum 2 occurrences)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activityCorrelations.map(({ activity, avgMood, count }) => (
            <div 
              key={activity} 
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-cyber-glow ${getMoodColor(avgMood)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="cyber-text font-semibold text-sm">{activity}</h4>
                {getImpactIcon(avgMood)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-cyber-text-muted text-xs">Average Mood</span>
                  <span className="cyber-text font-bold text-sm">{avgMood.toFixed(1)}/5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-cyber-text-muted text-xs">Frequency</span>
                  <span className="cyber-text text-sm font-mono">{count} times</span>
                </div>
                
                <div className={`text-xs font-medium ${getImpactColor(avgMood)}`}>
                  {getImpactText(avgMood)}
                </div>
              </div>

              {/* Mood bar visualization */}
              <div className="mt-3">
                <div className="w-full bg-cyber-border rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyber-primary to-cyber-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(avgMood / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary insights */}
      <div className="cyber-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-cyber-secondary" />
          <h4 className="cyber-label">Key Insights</h4>
        </div>
        <div className="space-y-2 text-sm">
          {activityCorrelations.length > 0 && (
            <>
              <p className="cyber-text">
                <span className="text-cyber-primary font-medium">
                  {activityCorrelations[0].activity}
                </span>{' '}
                has the highest positive impact on your mood ({activityCorrelations[0].avgMood.toFixed(1)}/5)
              </p>
              
              {activityCorrelations.length > 1 && (
                <p className="cyber-text">
                  <span className="text-red-400 font-medium">
                    {activityCorrelations[activityCorrelations.length - 1].activity}
                  </span>{' '}
                  shows the lowest mood correlation ({activityCorrelations[activityCorrelations.length - 1].avgMood.toFixed(1)}/5)
                </p>
              )}
              
              <p className="text-cyber-text-muted text-xs mt-3 font-mono">
                Your overall average mood is {overallAvgMood.toFixed(1)}/5
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
