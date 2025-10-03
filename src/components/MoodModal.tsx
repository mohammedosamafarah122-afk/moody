import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { X } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodModal: React.FC<MoodModalProps> = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');
  const [intensity, setIntensity] = useState(5);
  
  const { addMoodEntry } = useMood();

  const moodOptions = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😴', label: 'Tired' },
  ];

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }

    try {
      await addMoodEntry(selectedMood, notes, intensity);
      setSelectedMood('');
      setNotes('');
      setIntensity(5);
      onClose();
      alert('Mood saved successfully!');
    } catch (error) {
      alert('Failed to save mood');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">How are you feeling?</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Mood Selection */}
        <div className="p-6">
          <h3 className="font-semibold mb-4 text-gray-700">Select your mood</h3>
          <div className="grid grid-cols-3 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(`${mood.emoji} ${mood.label}`)}
                className={`p-4 rounded-xl transition-all ${
                  selectedMood === `${mood.emoji} ${mood.label}`
                    ? 'bg-blue-500 text-white transform scale-105 shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div className="p-6 border-t">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Intensity</h3>
            <span className="text-sm text-gray-600">{intensity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Notes */}
        <div className="p-6 border-t">
          <h3 className="font-semibold mb-3 text-gray-700">Notes (optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="p-6 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Mood
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodModal;