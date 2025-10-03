import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { MoodService, type CreateMoodEntryData } from '../../services/moodService'
import { Calendar, Save, Smile, Activity, BookOpen } from 'lucide-react'

const EMOTIONS = [
  'Happy', 'Sad', 'Angry', 'Anxious', 'Excited', 'Calm', 'Frustrated', 
  'Grateful', 'Lonely', 'Confident', 'Overwhelmed', 'Peaceful', 'Energetic', 'Tired'
]

const ACTIVITIES = [
  'Work', 'Exercise', 'Sleep', 'Socializing', 'Reading', 'Cooking', 'Gaming',
  'Music', 'Art', 'Nature', 'Learning', 'Cleaning', 'Shopping', 'Travel', 'Meditation'
]

const MOOD_LABELS = {
  1: 'Very Sad',
  2: 'Sad',
  3: 'Neutral',
  4: 'Happy',
  5: 'Very Happy'
}

const MOOD_EMOJIS = {
  1: '😢',
  2: '😞',
  3: '😐',
  4: '😊',
  5: '😄'
}

interface MoodFormProps {
  selectedDate?: string
  onSuccess?: () => void
}

export const MoodForm: React.FC<MoodFormProps> = ({ 
  selectedDate = format(new Date(), 'yyyy-MM-dd'),
  onSuccess 
}) => {
  const [formData, setFormData] = useState<CreateMoodEntryData>({
    date: selectedDate,
    mood_score: 3,
    emotions: [],
    activities: [],
    journal_entry: ''
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
    setFormData(prev => ({
      ...prev,
      emotions: Array.isArray(prev.emotions) && prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...(Array.isArray(prev.emotions) ? prev.emotions : []), emotion]
    }))
  }

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: Array.isArray(prev.activities) && prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...(Array.isArray(prev.activities) ? prev.activities : []), activity]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const { error: submitError } = await MoodService.createMoodEntry(formData)
      
      if (submitError) {
        setError(submitError.message)
      } else {
        setSuccess(true)
        setFormData(prev => ({
          ...prev,
          mood_score: 3,
          emotions: [],
          activities: [],
          journal_entry: ''
        }))
        onSuccess?.()
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Smile className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Log Your Mood</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="input-field"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          {/* Mood Scale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              How are you feeling today?
            </label>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleMoodSelect(score)}
                  className={`mood-button mood-${score} ${
                    formData.mood_score === score ? 'ring-4 ring-offset-2' : ''
                  }`}
                  title={MOOD_LABELS[score as keyof typeof MOOD_LABELS]}
                >
                  <span className="text-2xl">{MOOD_EMOJIS[score as keyof typeof MOOD_EMOJIS]}</span>
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-medium text-gray-600">
                {MOOD_LABELS[formData.mood_score as keyof typeof MOOD_LABELS]}
              </span>
            </div>
          </div>

          {/* Emotions */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Smile className="h-4 w-4" />
              <span>What emotions are you experiencing? (Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => handleEmotionToggle(emotion)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    Array.isArray(formData.emotions) && formData.emotions.includes(emotion)
                      ? 'bg-primary-100 text-primary-800 border-primary-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  } border`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Activity className="h-4 w-4" />
              <span>What activities did you do today? (Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => handleActivityToggle(activity)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    Array.isArray(formData.activities) && formData.activities.includes(activity)
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  } border`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Entry */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Journal Entry (Optional)</span>
            </label>
            <textarea
              value={formData.journal_entry}
              onChange={(e) => setFormData(prev => ({ ...prev, journal_entry: e.target.value }))}
              placeholder="Write about your day, thoughts, or anything you'd like to remember..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
              Mood entry saved successfully!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Mood Entry</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
