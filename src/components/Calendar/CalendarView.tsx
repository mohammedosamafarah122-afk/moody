import React, { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { MoodService, type MoodEntry } from '../../services/moodService'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { MoodEntryModal } from './MoodEntryModal'

const MOOD_EMOJIS = {
  1: '😢',
  2: '😞',
  3: '😐',
  4: '😊',
  5: '😄'
}

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadMonthEntries()
  }, [currentDate])

  const loadMonthEntries = async () => {
    setLoading(true)
    setError('')

    try {
      const monthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd')

      const { data, error } = await MoodService.getMoodEntriesInRange(monthStart, monthEnd)

      if (error) {
        setError(error.message)
      } else {
        setEntries(data || [])
      }
    } catch (err) {
      setError('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    )
  }

  const getEntryForDate = (date: Date): MoodEntry | undefined => {
    return Array.isArray(entries) ? entries.find(entry => isSameDay(new Date(entry.date), date)) : undefined
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
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 min-w-48 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Calendar Grid */}
      <div className="card">
        {/* Week Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
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
                  aspect-square p-2 border border-gray-200 rounded-lg transition-all cursor-pointer
                  ${isCurrentMonth ? 'hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                  ${isToday ? 'ring-2 ring-primary-500 ring-offset-1' : ''}
                  ${hasEntry ? 'bg-gradient-to-br from-white to-gray-50' : ''}
                `}
              >
                <div className="h-full flex flex-col items-center justify-between">
                  <span className={`text-sm font-medium ${isToday ? 'text-primary-600' : ''}`}>
                    {format(date, 'd')}
                  </span>
                  
                  {hasEntry && (
                    <div className="flex flex-col items-center space-y-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mood-${entry.mood_score}`}>
                        <span>{MOOD_EMOJIS[entry.mood_score as keyof typeof MOOD_EMOJIS]}</span>
                      </div>
                      <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
              <span>Has mood entry</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-primary-500 rounded-full"></div>
              <span>Today</span>
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
          onUpdate={loadMonthEntries}
        />
      )}
    </div>
  )
}
