import React from 'react'
import type { MoodEntry } from '../../contexts/MoodContext'
import { Brain, TrendingUp, Heart } from 'lucide-react'

interface EmotionAnalysisProps {
  entries: MoodEntry[]
}

export const EmotionAnalysis: React.FC<EmotionAnalysisProps> = ({ entries }) => {
  // Count emotion frequencies
  const emotionCounts = entries.reduce((acc, entry) => {
    if (entry.emotions) {
      entry.emotions.forEach((emotion: string) => {
        acc[emotion] = (acc[emotion] || 0) + 1
      })
    }
    return acc
  }, {} as Record<string, number>)

  // Sort emotions by frequency
  const sortedEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10) // Top 10 emotions

  // Calculate emotion-mood correlations
  const emotionMoodCorrelations = Object.keys(emotionCounts).map(emotion => {
    const entriesWithEmotion = entries.filter(entry => 
      entry.emotions?.includes(emotion)
    )
    
    if (entriesWithEmotion.length === 0) return { emotion, avgMood: 0 }
    
    const avgMood = entriesWithEmotion.reduce((sum, entry) => 
      sum + entry.mood_score, 0
    ) / entriesWithEmotion.length

    return {
      emotion,
      avgMood,
      count: entriesWithEmotion.length
    }
  }).sort((a, b) => b.avgMood - a.avgMood)

  const getMoodColor = (avgMood: number) => {
    if (avgMood >= 4.5) return 'bg-cyber-primary bg-opacity-20 text-cyber-primary border-cyber-primary'
    if (avgMood >= 3.5) return 'bg-cyber-accent bg-opacity-20 text-cyber-accent border-cyber-accent'
    if (avgMood >= 2.5) return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500'
    if (avgMood >= 1.5) return 'bg-orange-500 bg-opacity-20 text-orange-400 border-orange-500'
    return 'bg-red-500 bg-opacity-20 text-red-400 border-red-500'
  }

  if (sortedEmotions.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-cyber-text-muted">
        <Brain className="w-12 h-12 mb-4 text-cyber-border" />
        <p className="text-lg font-medium">No emotion data available</p>
        <p className="text-sm mt-2">Start logging moods with emotional patterns to see insights</p>
      </div>
    )
  }

  const maxCount = Math.max(...sortedEmotions.map(([, count]) => count as number))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Heart className="w-6 h-6 text-cyber-primary" />
        <h3 className="cyber-text text-xl font-bold">Emotional Pattern Analysis</h3>
      </div>

      {/* Most Frequent Emotions */}
      <div className="cyber-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cyber-accent" />
          <h4 className="cyber-label">Most Frequent Emotions</h4>
        </div>
        <div className="space-y-3">
          {sortedEmotions.map(([emotion, count]) => (
            <div key={emotion} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <span className="cyber-text font-medium min-w-24">
                  {emotion}
                </span>
                <div className="flex-1 bg-cyber-border rounded-full h-3 max-w-40">
                  <div 
                    className="bg-gradient-to-r from-cyber-primary to-cyber-accent h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((count as number) / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              <span className="cyber-text font-mono text-cyber-accent min-w-12 text-right">{count as number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion-Mood Correlations */}
      <div className="cyber-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-cyber-secondary" />
          <h4 className="cyber-label">Emotions by Average Mood</h4>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {emotionMoodCorrelations.slice(0, 15).map(({ emotion, avgMood, count }) => (
            <div key={emotion} className="flex items-center justify-between p-3 bg-cyber-surface rounded-lg border border-cyber-border">
              <div className="flex items-center space-x-3 flex-1">
                <span className="cyber-text font-medium min-w-24">
                  {emotion}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMoodColor(avgMood)}`}>
                  {avgMood.toFixed(1)}/5
                </span>
              </div>
              <span className="text-cyber-text-muted text-xs font-mono">{count} times</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
