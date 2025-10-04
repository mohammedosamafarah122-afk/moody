import React, { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { useMood } from '../../contexts/MoodContext'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Brain } from 'lucide-react'
import { MoodEntryModal } from './MoodEntryModal'
import { AIAssistant } from '../AIAssistant/AIAssistant'

const MOOD_EMOJIS = {
  1: '😢',
  2: '😞',
  3: '😐',
  4: '😊',
  5: '😄'
}

export const CalendarView: React.FC = () => {
  const { moodEntries, loading, fetchMoodEntries } = useMood()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchMoodEntries()
  }, [fetchMoodEntries])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    )
  }

  const getEntryForDate = (date: Date) => {
    return moodEntries.find(entry => isSameDay(new Date(entry.date), date))
  }

  const handleDayClick = (date: Date) => {
    const entry = getEntryForDate(date)
    if (entry) {
      setSelectedEntry(entry)
      setIsModalOpen(true)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add padding days for calendar grid
  const startDay = monthStart.getDay()
  const paddingStart = Array.from({ length: startDay }, (_, i) => {
    const date = new Date(monthStart)
    date.setDate(date.getDate() - (startDay - i))
    return date
  })

  const endDay = monthEnd.getDay()
  const paddingEnd = Array.from({ length: 6 - endDay }, (_, i) => {
    const date = new Date(monthEnd)
    date.setDate(date.getDate() + (i + 1))
    return date
  })

  const allDays = [...paddingStart, ...monthDays, ...paddingEnd]

  if (loading) {
    return (
      <div className="cyber-dashboard flex items-center justify-center min-h-64">
        <div className="cyber-card p-8 text-center">
          <div className="cyber-spinner mx-auto mb-4"></div>
          <p className="text-cyber-text-muted">Loading neural calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cyber-dashboard py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cyberpunk Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-10 w-10 text-cyber-primary" />
            <div>
              <h1 className="cyber-text text-4xl font-bold">Neural Calendar</h1>
              <p className="text-cyber-text-muted text-sm mt-1">Track your neural patterns over time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="cyber-btn-secondary p-3 hover:scale-105 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="cyber-text text-2xl font-bold min-w-48 text-center font-mono">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="cyber-btn-secondary p-3 hover:scale-105 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="cyber-card p-6">
          {/* Week Headers */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-cyber-text-muted py-3 font-mono">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {allDays.map((date, index) => {
              const entry = getEntryForDate(date)
              const isCurrentMonth = isSameMonth(date, currentDate)
              const isToday = isSameDay(date, new Date())
              const hasEntry = !!entry

              return (
                <div
                  key={index}
                  onClick={() => isCurrentMonth && handleDayClick(date)}
                  className={`
                    aspect-square p-2 border border-cyber-border rounded-lg transition-all cursor-pointer
                    ${isCurrentMonth ? 'hover:border-cyber-primary hover:shadow-cyber-glow' : 'bg-cyber-surface text-cyber-text-muted'}
                    ${isToday ? 'ring-2 ring-cyber-primary ring-offset-2 ring-offset-cyber-bg' : ''}
                    ${hasEntry ? 'bg-gradient-to-br from-cyber-surface to-cyber-border' : ''}
                    ${isCurrentMonth ? 'hover:scale-105' : ''}
                  `}
                >
                  <div className="h-full flex flex-col items-center justify-between">
                    <span className={`text-sm font-medium font-mono ${
                      isToday ? 'text-cyber-primary' : isCurrentMonth ? 'text-cyber-text' : 'text-cyber-text-muted'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    
                    {hasEntry && (
                      <div className="flex flex-col items-center space-y-1">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                          ${entry.mood_score === 1 ? 'bg-red-500' : 
                            entry.mood_score === 2 ? 'bg-orange-500' :
                            entry.mood_score === 3 ? 'bg-yellow-500' :
                            entry.mood_score === 4 ? 'bg-cyber-primary' :
                            'bg-cyber-accent'}
                        `}>
                          <span>{MOOD_EMOJIS[entry.mood_score as keyof typeof MOOD_EMOJIS]}</span>
                        </div>
                        <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cyberpunk Legend */}
          <div className="mt-8 pt-6 border-t border-cyber-border">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-cyber-text-muted">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                <span>Neural pattern recorded</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-cyber-primary rounded-full"></div>
                <span>Current date</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-cyber-accent" />
                <span>Click to view details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Entry Details Modal */}
        {selectedEntry && (
          <MoodEntryModal
            entry={selectedEntry}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedEntry(null)
            }}
            onUpdate={fetchMoodEntries}
          />
        )}
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}