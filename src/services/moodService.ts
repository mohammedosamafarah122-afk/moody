import { supabase, type MoodEntry } from '../lib/supabase'

export type { MoodEntry } from '../lib/supabase'

export interface CreateMoodEntryData {
  date: string
  mood_score: number
  intensity?: number
  emotions?: string[]
  activities?: string[]
  journal_entry?: string
}

export interface UpdateMoodEntryData extends Partial<CreateMoodEntryData> {
  id: string
}

export class MoodService {
  // Create a new mood entry (with upsert to handle duplicates)
  static async createMoodEntry(data: CreateMoodEntryData): Promise<{ data: MoodEntry | null; error: any }> {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data: moodEntry, error } = await supabase
      .from('mood_entries')
      .upsert({
        user_id: user.user.id,
        ...data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      })
      .select()
      .single()

    return { data: moodEntry, error }
  }

  // Get mood entries for the current user
  static async getMoodEntries(limit?: number): Promise<{ data: MoodEntry[] | null; error: any }> {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    let query = supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.user.id)
      .order('date', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    return { data, error }
  }

  // Get mood entries for a specific date range
  static async getMoodEntriesInRange(startDate: string, endDate: string): Promise<{ data: MoodEntry[] | null; error: any }> {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    return { data, error }
  }

  // Get a specific mood entry by date
  static async getMoodEntryByDate(date: string): Promise<{ data: MoodEntry | null; error: any }> {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('date', date)
      .single()

    return { data, error }
  }

  // Update a mood entry
  static async updateMoodEntry(data: UpdateMoodEntryData): Promise<{ data: MoodEntry | null; error: any }> {
    const { id, ...updateData } = data
    
    const { data: moodEntry, error } = await supabase
      .from('mood_entries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    return { data: moodEntry, error }
  }

  // Delete a mood entry
  static async deleteMoodEntry(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id)

    return { error }
  }

  // Get mood statistics
  static async getMoodStatistics(): Promise<{
    data: {
      averageMood: number
      totalEntries: number
      moodDistribution: Record<number, number>
      recentTrend: 'improving' | 'declining' | 'stable'
    } | null
    error: any
  }> {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data: entries, error } = await supabase
      .from('mood_entries')
      .select('mood_score, date')
      .eq('user_id', user.user.id)
      .order('date', { ascending: false })

    if (error || !entries) {
      return { data: null, error }
    }

    // Calculate statistics
    const totalEntries = entries.length
    const averageMood = totalEntries > 0 
      ? entries.reduce((sum, entry) => sum + entry.mood_score, 0) / totalEntries 
      : 0

    // Calculate mood distribution
    const moodDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    entries.forEach(entry => {
      moodDistribution[entry.mood_score]++
    })

    // Calculate recent trend (last 7 days vs previous 7 days)
    let recentTrend: 'improving' | 'declining' | 'stable' = 'stable'
    if (entries.length >= 7) {
      const recent7 = entries.slice(0, 7)
      const previous7 = entries.slice(7, 14)
      
      if (previous7.length >= 7) {
        const recentAvg = recent7.reduce((sum, entry) => sum + entry.mood_score, 0) / 7
        const previousAvg = previous7.reduce((sum, entry) => sum + entry.mood_score, 0) / 7
        
        if (recentAvg > previousAvg + 0.2) {
          recentTrend = 'improving'
        } else if (recentAvg < previousAvg - 0.2) {
          recentTrend = 'declining'
        }
      }
    }

    return {
      data: {
        averageMood,
        totalEntries,
        moodDistribution,
        recentTrend,
      },
      error: null
    }
  }
}

// Save mood entry with upsert functionality (for compatibility with existing code)
export const saveMoodEntry = async (userId: string, date: string, mood: string, notes?: string) => {
  // Convert mood string to mood_score number
  const moodScoreMap: Record<string, number> = {
    'terrible': 1,
    'poor': 2,
    'okay': 3,
    'good': 4,
    'excellent': 5,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5
  }
  
  const mood_score = moodScoreMap[mood.toLowerCase()] || parseInt(mood) || 3

  const { data, error } = await supabase
    .from('mood_entries')
    .upsert(
      {
        user_id: userId,
        date: date,
        mood_score: mood_score,
        journal_entry: notes,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      }
    )
    .select();

  if (error) {
    console.error('Error saving mood:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

// Create a service instance for easier importing
export const moodService = {
  createMoodEntry: MoodService.createMoodEntry,
  getMoodEntries: MoodService.getMoodEntries,
  getMoodEntriesInRange: MoodService.getMoodEntriesInRange,
  getMoodEntryByDate: MoodService.getMoodEntryByDate,
  updateMoodEntry: MoodService.updateMoodEntry,
  deleteMoodEntry: MoodService.deleteMoodEntry,
  getMoodStatistics: MoodService.getMoodStatistics,
  saveMoodEntry: saveMoodEntry,
}
