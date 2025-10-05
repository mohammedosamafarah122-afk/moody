import React, { useState } from 'react'
import { format } from 'date-fns'
import { MoodService, type MoodEntry } from '../../services/moodService'
import { X, Edit2, Trash2, Save, Smile, Activity, BookOpen, Calendar } from 'lucide-react'
import { getMoodEmoji, getMoodLabel } from '../../constants/moodEmojis'

interface MoodEntryModalProps {
  entry: MoodEntry
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

const EMOTIONS = [
  'Happy', 'Sad', 'Angry', 'Anxious', 'Excited', 'Calm', 'Frustrated', 
  'Grateful', 'Lonely', 'Confident', 'Overwhelmed', 'Peaceful', 'Energetic', 'Tired'
]

const ACTIVITIES = [
  'Work', 'Exercise', 'Sleep', 'Socializing', 'Reading', 'Cooking', 'Gaming',
  'Music', 'Art', 'Nature', 'Learning', 'Cleaning', 'Shopping', 'Travel', 'Meditation'
]

export const MoodEntryModal: React.FC<MoodEntryModalProps> = ({
  entry,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    mood_score: entry.mood_score,
    emotions: entry.emotions || [],
    activities: entry.activities || [],
    journal_entry: entry.journal_entry || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      mood_score: entry.mood_score,
      emotions: entry.emotions || [],
      activities: entry.activities || [],
      journal_entry: entry.journal_entry || ''
    })
    setError('')
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await MoodService.updateMoodEntry({
        id: entry.id,
        ...editData
      })

      if (error) {
        setError(error.message)
      } else {
        setIsEditing(false)
        onUpdate()
      }
    } catch (err) {
      setError('Failed to update entry')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this mood entry?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await MoodService.deleteMoodEntry(entry.id)

      if (error) {
        setError(error.message)
      } else {
        onClose()
        onUpdate()
      }
    } catch (err) {
      setError('Failed to delete entry')
    } finally {
      setLoading(false)
    }
  }

  const handleMoodSelect = (score: number) => {
    setEditData(prev => ({ ...prev, mood_score: score }))
  }

  const handleEmotionToggle = (emotion: string) => {
    setEditData(prev => ({
      ...prev,
      emotions: Array.isArray(prev.emotions) && prev.emotions.includes(emotion)
        ? prev.emotions.filter((e: string) => e !== emotion)
        : [...(Array.isArray(prev.emotions) ? prev.emotions : []), emotion]
    }))
  }

  const handleActivityToggle = (activity: string) => {
    setEditData(prev => ({
      ...prev,
      activities: Array.isArray(prev.activities) && prev.activities.includes(activity)
        ? prev.activities.filter((a: string) => a !== activity)
        : [...(Array.isArray(prev.activities) ? prev.activities : []), activity]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {format(new Date(entry.date), 'MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-gray-600">
                Logged at {format(new Date(entry.created_at), 'h:mm a')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mood Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mood Rating
            </label>
            {isEditing ? (
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleMoodSelect(score)}
                    className={`mood-button mood-${score} ${
                      editData.mood_score === score ? 'ring-4 ring-offset-2' : ''
                    }`}
                  >
                    <span className="text-2xl">{getMoodEmoji(score)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <div className={`mood-button mood-${entry.mood_score}`}>
                  <span className="text-2xl">{getMoodEmoji(entry.mood_score)}</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {getMoodLabel(entry.mood_score)}
                  </p>
                  <p className="text-sm text-gray-600">Score: {entry.mood_score}/5</p>
                </div>
              </div>
            )}
          </div>

          {/* Emotions */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Smile className="h-4 w-4" />
              <span>Emotions</span>
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map((emotion: string) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => handleEmotionToggle(emotion)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      Array.isArray(editData.emotions) && editData.emotions.includes(emotion)
                        ? 'bg-primary-100 text-primary-800 border-primary-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                    } border`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {entry.emotions && Array.isArray(entry.emotions) && entry.emotions.length > 0 ? (
                  entry.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {emotion}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No emotions recorded</p>
                )}
              </div>
            )}
          </div>

          {/* Activities */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Activity className="h-4 w-4" />
              <span>Activities</span>
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity: string) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleActivityToggle(activity)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      Array.isArray(editData.activities) && editData.activities.includes(activity)
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                    } border`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {entry.activities && Array.isArray(entry.activities) && entry.activities.length > 0 ? (
                  entry.activities.map((activity) => (
                    <span
                      key={activity}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {activity}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No activities recorded</p>
                )}
              </div>
            )}
          </div>

          {/* Journal Entry */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Journal Entry</span>
            </label>
            {isEditing ? (
              <textarea
                value={editData.journal_entry}
                onChange={(e) => setEditData(prev => ({ ...prev, journal_entry: e.target.value }))}
                placeholder="Write about your day..."
                rows={4}
                className="input-field resize-none"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                {entry.journal_entry ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.journal_entry}</p>
                ) : (
                  <p className="text-gray-500 italic">No journal entry</p>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </div>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className="btn-secondary"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
