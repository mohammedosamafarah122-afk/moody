import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cenbyxypkoafdmzbomqa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbmJ5eHlwa29hZmRtemJvbXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzQ2NDYsImV4cCI6MjA3NDk1MDY0Nn0.6csM4Ao6lj19Ro1FrgSK-NrzIkOuDpuBDC__2WzV-Ag'

console.log('🔗 Supabase URL:', supabaseUrl)
console.log('🔑 Supabase Key exists:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test connection on load
supabase.from('mood_entries').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.warn('⚠️ Database connection issue:', error.message)
      if (error.message.includes('relation "public.mood_entries" does not exist')) {
        console.error('❌ Database tables not created yet. Please run the SQL schema in Supabase.')
      }
    } else {
      console.log('✅ Database connection successful!')
    }
  })

// Database Types
export type MoodEntry = {
  id: string
  user_id: string
  date: string
  mood_score: number
  emotions?: string[]
  activities?: string[]
  journal_entry?: string
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  user_id: string
  username?: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}
