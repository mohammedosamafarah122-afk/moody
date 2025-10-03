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
    try {
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

      // Format the date correctly
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('mood_entries')
        .upsert({
          user_id: user.id,
          date: today,
          mood_score: mood_score,
          journal_entry: notes || '',
          intensity: intensity || 5,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Update local state
      setMoodEntries(prev => {
        const filtered = prev.filter(entry => 
          !(entry.date === today && entry.user_id === user.id)
        );
        return [data, ...filtered];
      });
      
      return data;
    } catch (error) {
      console.error('Error in addMoodEntry:', error);
      throw error;
    }
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
