import React from 'react'
import type { MoodEntry } from '../../contexts/MoodContext'

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
    if (avgMood >= 4.5) return 'bg-purple-100 text-purple-800'
    if (avgMood >= 3.5) return 'bg-green-100 text-green-800'
    if (avgMood >= 2.5) return 'bg-yellow-100 text-yellow-800'
    if (avgMood >= 1.5) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  if (sortedEmotions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No emotion data available
      </div>
    )
  }

  const maxCount = Math.max(...sortedEmotions.map(([, count]) => count as number))

  return (
    <div className="space-y-6">
      {/* Most Frequent Emotions */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Most Frequent Emotions</h4>
        <div className="space-y-2">
          {sortedEmotions.map(([emotion, count]) => (
            <div key={emotion} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900 min-w-20">
                  {emotion}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((count as number) / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{count as number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion-Mood Correlations */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Emotions by Average Mood</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {emotionMoodCorrelations.slice(0, 15).map(({ emotion, avgMood, count }) => (
            <div key={emotion} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900 min-w-20">
                  {emotion}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(avgMood)}`}>
                  {avgMood.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500">{count} times</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
