import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood_score: number;
  journal_entry?: string;
  intensity?: number;
  emotions?: string[];
  activities?: string[];
  created_at: string;
  updated_at: string;
}

interface MoodStats {
  totalEntries: number;
  currentStreak: number;
  averageIntensity: number;
  weeklyAverage: number;
  moodFrequency: { [key: string]: number };
  mostCommonMood: string;
}

interface MoodContextType {
  moodEntries: MoodEntry[];
  loading: boolean;
  stats: MoodStats;
  fetchMoodEntries: () => Promise<void>;
  addMoodEntry: (mood: string, notes?: string, intensity?: number, emotions?: string[], activities?: string[]) => Promise<MoodEntry>;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
  getMoodEntryByDate: (date: string) => MoodEntry | null;
  refreshData: () => Promise<void>;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMoodEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMoodEntries([]);
        return;
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      console.log('Fetched mood entries:', data);
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMoodEntry = useCallback(async (mood: string, notes?: string, intensity?: number, emotions?: string[], activities?: string[]) => {
    try {
      console.log('Starting addMoodEntry...');
      
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication failed');
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error('Please log in to save moods');
      }

      console.log('User:', user.id);

      // Format date
      const today = new Date().toISOString().split('T')[0];
      console.log('Date:', today);

      // Convert mood string to mood_score number
      const moodScoreMap: Record<string, number> = {
        '😊 happy': 5, '😐 neutral': 3, '😔 sad': 2, '😡 angry': 1, '😴 tired': 2,
        '😰 anxious': 2, '🤩 excited': 5, '😌 relaxed': 4,
        'happy': 5, 'neutral': 3, 'sad': 2, 'angry': 1, 'tired': 2,
        'anxious': 2, 'excited': 5, 'relaxed': 4
      }

      // Extract mood label from emoji + label format
      const moodLabel = mood.replace(/^[^\w\s]*\s*/, '').toLowerCase()
      const mood_score = moodScoreMap[moodLabel] || 3

      // Prepare data with hashtag patterns in journal entry
      const emotionTags = emotions ? emotions.map(e => `#${e}`).join(' ') : '';
      const activityTags = activities ? activities.map(a => `#${a}`).join(' ') : '';
      const journalWithPatterns = [notes, emotionTags, activityTags].filter(Boolean).join(' ');

      const moodData = {
        user_id: user.id,
        date: today,
        mood_score,
        journal_entry: journalWithPatterns,
        intensity: intensity || 5,
        updated_at: new Date().toISOString()
      };

      console.log('Saving data:', moodData);
      console.log('Emotions array:', emotions);
      console.log('Activities array:', activities);
      console.log('Journal with patterns:', journalWithPatterns);

      // Save to database
      const { data, error } = await supabase
        .from('mood_entries')
        .upsert(moodData, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Save successful:', data);
      console.log('Saved journal entry:', data.journal_entry);
      
      // Refresh the entries
      await fetchMoodEntries();
      
      return data;
    } catch (error: any) {
      console.error('Error in addMoodEntry:', error);
      throw error; // Re-throw to handle in component
    }
  }, [fetchMoodEntries]);

  const updateMoodEntry = useCallback(async (id: string, updates: Partial<MoodEntry>) => {
    const { error } = await supabase
      .from('mood_entries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    await fetchMoodEntries();
  }, [fetchMoodEntries]);

  const deleteMoodEntry = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchMoodEntries();
  }, [fetchMoodEntries]);

  const getMoodEntryByDate = useCallback((date: string): MoodEntry | null => {
    return moodEntries.find(entry => entry.date === date) || null;
  }, [moodEntries]);

  const refreshData = useCallback(async () => {
    await fetchMoodEntries();
  }, [fetchMoodEntries]);

  // Calculate stats
  const stats = React.useMemo((): MoodStats => {
    if (moodEntries.length === 0) {
      return {
        totalEntries: 0,
        currentStreak: 0,
        averageIntensity: 0,
        weeklyAverage: 0,
        moodFrequency: {},
        mostCommonMood: 'No data'
      };
    }

    // Mood frequency based on mood_score
    const moodFrequency = moodEntries.reduce((acc, entry) => {
      const moodLabel = getMoodLabel(entry.mood_score);
      acc[moodLabel] = (acc[moodLabel] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Most common mood
    const mostCommonMood = Object.entries(moodFrequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'No data';

    // Average intensity
    const validIntensities = moodEntries.filter(entry => entry.intensity);
    const averageIntensity = validIntensities.length > 0 
      ? Number((validIntensities.reduce((sum, entry) => sum + (entry.intensity || 0), 0) / validIntensities.length).toFixed(1))
      : 0;

    // Weekly average
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEntries = moodEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );
    const weeklyValidIntensities = weeklyEntries.filter(entry => entry.intensity);
    const weeklyAverage = weeklyValidIntensities.length > 0 
      ? Number((weeklyValidIntensities.reduce((sum, entry) => sum + (entry.intensity || 0), 0) / weeklyValidIntensities.length).toFixed(1))
      : 0;

    // Streak calculation
    let streak = 0;
    const today = new Date();
    const dates = new Set(moodEntries.map(entry => entry.date));
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      if (dates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalEntries: moodEntries.length,
      currentStreak: streak,
      averageIntensity,
      weeklyAverage,
      moodFrequency,
      mostCommonMood
    };
  }, [moodEntries]);

  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  const value: MoodContextType = {
    moodEntries,
    loading,
    stats,
    fetchMoodEntries,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getMoodEntryByDate,
    refreshData
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = (): MoodContextType => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

const getMoodLabel = (moodScore: number) => {
  const moodLabels: { [key: number]: string } = {
    1: 'Terrible',
    2: 'Poor', 
    3: 'Okay',
    4: 'Good',
    5: 'Excellent',
  };
  return moodLabels[moodScore] || 'Unknown';
};