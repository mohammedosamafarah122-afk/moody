import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useMood } from '../../contexts/MoodContext'
import { Calendar, Save, Smile, Activity, BookOpen, Brain, Zap, Target } from 'lucide-react'
import { AIAssistant } from '../AIAssistant/AIAssistant'
import { MOOD_EMOJIS, MOOD_LABELS } from '../../constants/moodEmojis'

const EMOTIONS = [
  'Happy', 'Sad', 'Angry', 'Anxious', 'Excited', 'Calm', 'Frustrated', 
  'Grateful', 'Lonely', 'Confident', 'Overwhelmed', 'Peaceful', 'Energetic', 'Tired'
]

const ACTIVITIES = [
  'Work', 'Exercise', 'Sleep', 'Socializing', 'Reading', 'Cooking', 'Gaming',
  'Music', 'Art', 'Nature', 'Learning', 'Cleaning', 'Shopping', 'Travel', 'Meditation'
]

interface MoodFormProps {
  selectedDate?: string
  onSuccess?: () => void
}

export const MoodForm: React.FC<MoodFormProps> = ({ 
  selectedDate = format(new Date(), 'yyyy-MM-dd'),
  onSuccess 
}) => {
  const { addMoodEntry } = useMood()
  const [formData, setFormData] = useState({
    date: selectedDate,
    mood_score: 3,
    emotions: [] as string[],
    activities: [] as string[],
    journal_entry: '',
    intensity: 5
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate }))
  }, [selectedDate])

  const handleMoodSelect = (score: number) => {
    setFormData(prev => ({ ...prev, mood_score: score }))
  }

  const handleEmotionToggle = (emotion: string) => {
    console.log('🔍 Emotion clicked:', emotion);
    setFormData(prev => {
      const newEmotions = prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion];
      console.log('🔍 New emotions array:', newEmotions);
      return {
        ...prev,
        emotions: newEmotions
      };
    });
  }

  const handleActivityToggle = (activity: string) => {
    console.log('🔍 Activity clicked:', activity);
    setFormData(prev => {
      const newActivities = prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity];
      console.log('🔍 New activities array:', newActivities);
      return {
        ...prev,
        activities: newActivities
      };
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const moodString = `${MOOD_EMOJIS[formData.mood_score as keyof typeof MOOD_EMOJIS]} ${MOOD_LABELS[formData.mood_score as keyof typeof MOOD_LABELS]}`
      const notes = formData.journal_entry
      
      console.log('🔍 MoodForm Debug - Before addMoodEntry:');
      console.log('Mood string:', moodString);
      console.log('Notes:', notes);
      console.log('Intensity:', formData.intensity);
      console.log('Emotions array:', formData.emotions);
      console.log('Activities array:', formData.activities);
      
      await addMoodEntry(moodString, notes, formData.intensity, formData.emotions, formData.activities)
      
      setSuccess(true)
      setFormData(prev => ({
        ...prev,
        mood_score: 3,
        emotions: [],
        activities: [],
        journal_entry: '',
        intensity: 5
      }))
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cyber-dashboard py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cyber-card p-8">
          {/* Cyberpunk Header */}
          <div className="flex items-center space-x-3 mb-8">
            <Brain className="h-8 w-8 text-cyber-primary" />
            <div>
              <h2 className="cyber-text text-3xl font-bold">Neural Input Interface</h2>
              <p className="text-cyber-text-muted text-sm mt-1">Record your neural patterns and emotional state</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date Selection */}
            <div className="cyber-form-group">
              <label className="cyber-label flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Neural Date</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="cyber-input"
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            {/* Mood Scale */}
            <div className="cyber-form-group">
              <label className="cyber-label flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Neural Pattern Assessment</span>
              </label>
              <div className="flex justify-center space-x-4 mb-4">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleMoodSelect(score)}
                    className={`cyber-mood-indicator ${
                      formData.mood_score === score ? 'selected' : ''
                    }`}
                    title={MOOD_LABELS[score as keyof typeof MOOD_LABELS]}
                  >
                    <span className="text-3xl mb-2">{MOOD_EMOJIS[score as keyof typeof MOOD_EMOJIS]}</span>
                    <span className="text-xs font-medium">{score}</span>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <span className="cyber-text text-lg font-bold">
                  {MOOD_LABELS[formData.mood_score as keyof typeof MOOD_LABELS]}
                </span>
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="cyber-form-group">
              <label className="cyber-label flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Neural Intensity</span>
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-cyber-text-muted text-sm">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={(e) => setFormData(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                  className="cyber-slider flex-1"
                />
                <span className="text-cyber-text-muted text-sm">High</span>
                <span className="cyber-text text-lg font-mono w-12 text-center">{formData.intensity}/10</span>
              </div>
            </div>

            {/* Emotions */}
            <div className="cyber-form-group">
              <label className="cyber-label flex items-center space-x-2">
                <Smile className="h-4 w-4" />
                <span>Emotional Patterns (Optional)</span>
                {formData.emotions.length > 0 && (
                  <span className="text-cyber-accent text-sm">
                    ({formData.emotions.length} selected)
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => handleEmotionToggle(emotion)}
                    className={`cyber-badge cursor-pointer transition-all ${
                      formData.emotions.includes(emotion)
                        ? 'bg-cyber-primary bg-opacity-30 text-cyber-primary border-cyber-primary shadow-cyber-glow'
                        : 'bg-cyber-border bg-opacity-20 text-cyber-text-muted border-cyber-border hover:border-cyber-primary hover:bg-opacity-30'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              {formData.emotions.length > 0 && (
                <div className="mt-2 text-sm text-cyber-accent">
                  Selected: {formData.emotions.join(', ')}
                </div>
              )}
            </div>

            {/* Activities */}
            <div className="cyber-form-group">
              <label className="cyber-label flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Activity Patterns (Optional)</span>
                {formData.activities.length > 0 && (
                  <span className="text-cyber-accent text-sm">
                    ({formData.activities.length} selected)
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleActivityToggle(activity)}
                    className={`cyber-badge cursor-pointer transition-all ${
                      formData.activities.includes(activity)
                        ? 'bg-cyber-accent bg-opacity-30 text-cyber-accent border-cyber-accent shadow-cyber-glow'
                        : 'bg-cyber-border bg-opacity-20 text-cyber-text-muted border-cyber-border hover:border-cyber-accent hover:bg-opacity-30'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
              {formData.activities.length > 0 && (
                <div className="mt-2 text-sm text-cyber-accent">
                  Selected: {formData.activities.join(', ')}
                </div>
              )}
            </div>

            {/* Journal Entry */}
            <div className="cyber-form-group">
              <label className="cyber-label flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Neural Notes (Optional)</span>
              </label>
              <textarea
                value={formData.journal_entry}
                onChange={(e) => setFormData(prev => ({ ...prev, journal_entry: e.target.value }))}
                placeholder="Record your thoughts, experiences, or any additional neural patterns..."
                rows={4}
                className="cyber-textarea"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="cyber-alert cyber-alert-error">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="cyber-alert cyber-alert-success">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Neural pattern recorded successfully!
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="cyber-spinner w-5 h-5 mr-3"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Save className="h-5 w-5" />
                  <span>Save Neural Pattern</span>
                  <Brain className="h-5 w-5" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}