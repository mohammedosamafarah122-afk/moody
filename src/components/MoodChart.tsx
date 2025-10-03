import React, { useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { MoodEntry } from '../services/moodService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface MoodChartProps {
  entries: MoodEntry[]
}

export const MoodChart: React.FC<MoodChartProps> = ({ entries }) => {
  const chartRef = useRef<ChartJS<'line'>>(null)

  // Chart.js color configuration (currently unused but kept for future use)
  // const chartColors = {
  //   background: [
  //     'rgba(139, 92, 246, 0.6)', // Purple
  //     'rgba(6, 182, 212, 0.6)',  // Cyan
  //     'rgba(16, 185, 129, 0.6)', // Green
  //     'rgba(245, 158, 11, 0.6)', // Yellow
  //     'rgba(239, 68, 68, 0.6)',  // Red
  //   ],
  //   border: [
  //     'rgb(139, 92, 246)', // Purple
  //     'rgb(6, 182, 212)',  // Cyan
  //     'rgb(16, 185, 129)', // Green
  //     'rgb(245, 158, 11)', // Yellow
  //     'rgb(239, 68, 68)',  // Red
  //   ]
  // }

  // Process data for the last 30 days
  const processChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    const chartData = last30Days.map(date => {
      const entry = entries.find(e => e.date === date)
      return {
        date,
        mood: entry?.mood_score || null
      }
    })

    return chartData
  }

  const chartData = processChartData()

  const data = {
    labels: chartData.map(d => {
      const date = new Date(d.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    datasets: [
      {
        label: 'Mood Score',
        data: chartData.map(d => d.mood),
        borderColor: 'rgb(139, 92, 246)', // Vibrant Purple
        backgroundColor: 'rgba(139, 92, 246, 0.15)', // Purple with transparency
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartData.map(d => {
          if (d.mood === null) return 'rgba(156, 163, 175, 0.5)'
          // Use the new vibrant mood colors
          const colors = ['', '#f87171', '#fb923c', '#facc15', '#4ade80', '#a78bfa']
          return colors[d.mood] || '#6b7280'
        }),
        pointBorderColor: chartData.map(d => {
          if (d.mood === null) return 'rgba(156, 163, 175, 0.8)'
          // Use the new vibrant mood colors
          const colors = ['', '#db2777', '#ef4444', '#f97316', '#14b8a6', '#4f46e5']
          return colors[d.mood] || '#6b7280'
        }),
        pointBorderWidth: 3,
        pointRadius: 7,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
        pointHoverBorderWidth: 4,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: 600
        },
        bodyFont: {
          family: 'Inter',
          size: 13
        },
        padding: 12,
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex
            const date = new Date(chartData[dataIndex].date)
            return date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })
          },
          label: (context: any) => {
            const mood = context.parsed.y
            if (mood === null) return 'No mood logged'
            const labels = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent']
            return `${mood}/5 - ${labels[mood]}`
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: 'Inter',
            size: 12
          },
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        min: 0.5,
        max: 5.5,
        ticks: {
          stepSize: 1,
          color: '#6b7280',
          font: {
            family: 'Inter',
            size: 12
          },
          callback: (value: any) => {
            const labels = ['', '1', '2', '3', '4', '5']
            return labels[value] || ''
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff'
      }
    }
  }

  if (entries.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">No mood data yet</h3>
          <p className="text-slate-500">Start logging your moods to see trends</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="h-80">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      
      {/* Chart overlay with insights */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-purple-200/30">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600"></div>
            <span className="text-slate-600 font-medium">Trend</span>
          </div>
          {chartData.filter(d => d.mood !== null).length > 1 && (
            <div className="text-slate-600">
              {getTrendDirection(chartData)} 
              <span className="ml-1 text-slate-500">
                {getTrendPercentage(chartData)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions for trend analysis
function getTrendDirection(data: Array<{ mood: number | null }>): string {
  const validData = data.filter(d => d.mood !== null)
  if (validData.length < 2) return 'No trend'
  
  const first = validData[0].mood!
  const last = validData[validData.length - 1].mood!
  
  if (last > first) return '↗️'
  if (last < first) return '↘️'
  return '→'
}

function getTrendPercentage(data: Array<{ mood: number | null }>): number {
  const validData = data.filter(d => d.mood !== null)
  if (validData.length < 2) return 0
  
  const first = validData[0].mood!
  const last = validData[validData.length - 1].mood!
  
  return Math.round(((last - first) / first) * 100)
}
