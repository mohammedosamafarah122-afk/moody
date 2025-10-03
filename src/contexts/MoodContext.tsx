import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { moodService } from '../services/moodService'
import { supabase } from '../lib/supabase'
import type { MoodEntry } from '../lib/supabase'

interface MoodContextType {
  moodEntries: MoodEntry[]
  loading: boolean
  addMoodEntry: (mood: string, notes?: string, intensity?: number) => Promise<MoodEntry>
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

  const refreshMoodEntries = React.useCallback(async () => {
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
  }, [user])

  const addMoodEntry = async (mood: string, notes?: string, intensity?: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Convert mood string to mood_score number
    const moodScoreMap: Record<string, number> = {
      '😊 happy': 5,
      '😐 neutral': 3,
      '😔 sad': 2,
      '😡 angry': 1,
      '😴 tired': 2,
      '😰 anxious': 2,
      '🤩 excited': 5,
      '😌 relaxed': 4,
      'happy': 5,
      'neutral': 3,
      'sad': 2,
      'angry': 1,
      'tired': 2,
      'anxious': 2,
      'excited': 5,
      'relaxed': 4
    }

    // Extract mood label from emoji + label format
    const moodLabel = mood.replace(/^[^\w\s]*\s*/, '').toLowerCase()
    const mood_score = moodScoreMap[moodLabel] || 3

    const { data, error } = await supabase
      .from('mood_entries')
      .upsert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        mood_score,
        journal_entry: notes,
        intensity,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    setMoodEntries(prev => [data, ...prev.filter(e => 
      e.date !== data.date || e.user_id !== data.user_id
    )]);
    
    return data;
  }

  useEffect(() => {
    if (user) {
      refreshMoodEntries()
    } else {
      setMoodEntries([])
    }
  }, [user, refreshMoodEntries])

  const value = {
    moodEntries,
    loading,
    addMoodEntry,
    refreshMoodEntries
  }

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>
}
