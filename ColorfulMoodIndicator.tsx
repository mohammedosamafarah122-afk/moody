import React from 'react'

interface ColorfulMoodIndicatorProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export const ColorfulMoodIndicator: React.FC<ColorfulMoodIndicatorProps> = ({
  score,
  size = 'md',
  showLabel = true,
  animated = true
}) => {
  // Each mood gets its own color theme
  // const moodThemes = {
  //   1: 'bg-gradient-to-br from-red-400 to-pink-600', // Sad
  //   2: 'bg-gradient-to-br from-orange-400 to-red-500', // Down
  //   3: 'bg-gradient-to-br from-yellow-400 to-orange-500', // Neutral
  //   4: 'bg-gradient-to-br from-green-400 to-teal-500', // Good
  //   5: 'bg-gradient-to-br from-purple-400 to-indigo-600', // Excellent
  // }

  const getMoodConfig = (score: number) => {
    const configs = {
      1: {
        label: 'Terrible',
        color: 'from-red-400 to-pink-600',
        bgColor: 'from-red-50 to-pink-100',
        textColor: 'text-red-700',
        emoji: '😢',
        description: 'Feeling really down',
        shadow: 'shadow-red-400/40'
      },
      2: {
        label: 'Poor',
        color: 'from-orange-400 to-red-500',
        bgColor: 'from-orange-50 to-red-100',
        textColor: 'text-orange-700',
        emoji: '😔',
        description: 'Not feeling great',
        shadow: 'shadow-orange-400/40'
      },
      3: {
        label: 'Okay',
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'from-yellow-50 to-orange-100',
        textColor: 'text-yellow-700',
        emoji: '😐',
        description: 'Just okay',
        shadow: 'shadow-yellow-400/40'
      },
      4: {
        label: 'Good',
        color: 'from-green-400 to-teal-500',
        bgColor: 'from-green-50 to-teal-100',
        textColor: 'text-green-700',
        emoji: '😊',
        description: 'Feeling good',
        shadow: 'shadow-green-400/40'
      },
      5: {
        label: 'Excellent',
        color: 'from-purple-400 to-indigo-600',
        bgColor: 'from-purple-50 to-indigo-100',
        textColor: 'text-purple-700',
        emoji: '🤩',
        description: 'Feeling amazing',
        shadow: 'shadow-purple-400/40'
      }
    }
    return configs[score as keyof typeof configs] || configs[3]
  }

  const getSizeClasses = (size: string) => {
    const sizes = {
      sm: {
        container: 'w-8 h-8',
        emoji: 'text-sm',
        label: 'text-xs'
      },
      md: {
        container: 'w-12 h-12',
        emoji: 'text-lg',
        label: 'text-sm'
      },
      lg: {
        container: 'w-16 h-16',
        emoji: 'text-2xl',
        label: 'text-base'
      }
    }
    return sizes[size as keyof typeof sizes] || sizes.md
  }

  const config = getMoodConfig(score)
  const sizeClasses = getSizeClasses(size)

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={`
          ${sizeClasses.container} 
          rounded-full 
          bg-gradient-to-br ${config.color}
          flex items-center justify-center
          shadow-lg ${config.shadow}
          ${animated ? 'hover:scale-110 transition-transform duration-200' : ''}
          relative overflow-hidden
          ring-2 ring-white/20
        `}
      >
        {/* Shimmer effect */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        )}
        
        <span className={`${sizeClasses.emoji} relative z-10`}>
          {config.emoji}
        </span>
      </div>
      
      {showLabel && (
        <div className="text-center">
          <div className={`font-semibold ${config.textColor} ${sizeClasses.label}`}>
            {config.label}
          </div>
          <div className="text-xs text-gray-500">
            {config.description}
          </div>
        </div>
      )}
    </div>
  )
}

// Mood scale component
export const MoodScale: React.FC<{ onSelect?: (score: number) => void; selectedScore?: number }> = ({
  onSelect,
  selectedScore
}) => {
  return (
    <div className="flex justify-between items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          onClick={() => onSelect?.(score)}
          className={`
            flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200
            ${selectedScore === score 
              ? 'bg-gradient-to-br from-primary/20 to-secondary/20 scale-110 shadow-lg' 
              : 'hover:bg-white/50 hover:scale-105'
            }
          `}
        >
          <ColorfulMoodIndicator score={score} size="md" showLabel={true} />
        </button>
      ))}
    </div>
  )
}

// Mood trend indicator
export const MoodTrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable'; percentage: number }> = ({
  trend,
  percentage
}) => {
  const getTrendConfig = (trend: string) => {
    const configs = {
      up: {
        color: 'text-success',
        bgColor: 'bg-success/20',
        icon: '📈',
        label: 'Improving'
      },
      down: {
        color: 'text-error',
        bgColor: 'bg-error/20',
        icon: '📉',
        label: 'Declining'
      },
      stable: {
        color: 'text-warning',
        bgColor: 'bg-warning/20',
        icon: '➡️',
        label: 'Stable'
      }
    }
    return configs[trend as keyof typeof configs] || configs.stable
  }

  const config = getTrendConfig(trend)

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full ${config.bgColor}`}>
      <span className="text-sm">{config.icon}</span>
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label} {Math.abs(percentage)}%
      </span>
    </div>
  )
}
