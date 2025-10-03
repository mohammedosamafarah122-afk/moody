import React from 'react'
import { useMood } from '../contexts/MoodContext'

const QuickActions: React.FC = () => {
  const { addMoodEntry } = useMood()

  const handleAddMood = async (mood: string) => {
    try {
      await addMoodEntry(mood, `Feeling ${mood} today`)
      alert('Mood saved successfully!')
    } catch (error) {
      console.error('Error saving mood:', error)
      alert('Failed to save mood')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => handleAddMood('😊 Happy')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          😊 Happy
        </button>
        <button 
          onClick={() => handleAddMood('😐 Neutral')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          😐 Neutral
        </button>
        <button 
          onClick={() => handleAddMood('😔 Sad')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          😔 Sad
        </button>
        <button 
          onClick={() => handleAddMood('😡 Angry')}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          😡 Angry
        </button>
        <button 
          onClick={() => handleAddMood('😴 Tired')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          😴 Tired
        </button>
      </div>
    </div>
  )
}

export default QuickActions