import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { moodService, type CreateMoodEntryData } from '../services/moodService'
import type { MoodEntry } from '../lib/supabase'

interface MoodContextType {
  moodEntries: MoodEntry[]
  loading: boolean
  addMoodEntry: (mood: string, notes?: string) => Promise<void>
  refreshMoodEntries: () => Promise<void>
}

const MoodContext = createContext<MoodContextType | undefined>(undefined)

export const useMood = () => {
  const context = useContext(MoodContext)
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider')
  }
  return context
}

interface MoodProviderProps {
  children: React.ReactNode
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshMoodEntries = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await moodService.getMoodEntries()
      if (error) {
        console.error('Error fetching mood entries:', error)
      } else {
        setMoodEntries(data || [])
      }
    } catch (error) {
      console.error('Error refreshing mood entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMoodEntry = async (mood: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated')

    // Convert mood string to mood_score number
    const moodScoreMap: Record<string, number> = {
      '😊 happy': 5,
      '😐 neutral': 3,
      '😔 sad': 2,
      '😡 angry': 1,
      '😴 tired': 2,
      'happy': 5,
      'neutral': 3,
      'sad': 2,
      'angry': 1,
      'tired': 2
    }

    const mood_score = moodScoreMap[mood.toLowerCase()] || 3
    const today = new Date().toISOString().split('T')[0]

    const moodData: CreateMoodEntryData = {
      date: today,
      mood_score,
      journal_entry: notes || `Feeling ${mood} today`
    }

    try {
      const { error } = await moodService.createMoodEntry(moodData)
      if (error) {
        throw error
      }
      // Refresh the mood entries after adding
      await refreshMoodEntries()
    } catch (error) {
      console.error('Error adding mood entry:', error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      refreshMoodEntries()
    } else {
      setMoodEntries([])
    }
  }, [user])

  const value = {
    moodEntries,
    loading,
    addMoodEntry,
    refreshMoodEntries
  }

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>
}
