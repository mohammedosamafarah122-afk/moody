import React from 'react'
import { Line } from 'react-chartjs-2'
import { format, parseISO } from 'date-fns'
import type { MoodEntry } from '../../services/moodService'

interface MoodTrendChartProps {
  entries: MoodEntry[]
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ entries }) => {
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Calculate 7-day moving average
  const calculateMovingAverage = (data: number[], windowSize: number) => {
    const result: number[] = []
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1)
      const window = data.slice(start, i + 1)
      const average = window.reduce((sum, val) => sum + val, 0) / window.length
      result.push(average)
    }
    return result
  }

  const moodScores = sortedEntries.map(entry => entry.mood_score)
  const movingAverage = calculateMovingAverage(moodScores, 7)

  const data = {
    labels: sortedEntries.map(entry => format(parseISO(entry.date), 'MMM d')),
    datasets: [
      {
        label: 'Daily Mood',
        data: moodScores,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointBackgroundColor: sortedEntries.map(entry => {
          const colors = {
            1: '#ef4444',
            2: '#f97316', 
            3: '#eab308',
            4: '#22c55e',
            5: '#8b5cf6'
          }
          return colors[entry.mood_score as keyof typeof colors]
        }),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '7-Day Average',
        data: movingAverage,
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (context.datasetIndex === 0) {
              const moodLabels = {
                1: 'Very Sad',
                2: 'Sad', 
                3: 'Neutral',
                4: 'Happy',
                5: 'Very Happy'
              }
              return `Mood: ${moodLabels[context.parsed.y as keyof typeof moodLabels]}`
            } else {
              return `7-Day Average: ${context.parsed.y.toFixed(1)}`
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            const labels = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy']
            return labels[value]
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
        }
      }
    },
  }

  if (entries.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available for trend analysis
      </div>
    )
  }

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  )
}
