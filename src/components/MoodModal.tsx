import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { X, Plus, Hash } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodModal: React.FC<MoodModalProps> = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  
  const { addMoodEntry } = useMood();

  const moodOptions = [
    { emoji: '😊', label: 'Happy', color: 'from-green-400 to-green-600' },
    { emoji: '😐', label: 'Neutral', color: 'from-yellow-400 to-yellow-600' },
    { emoji: '😔', label: 'Sad', color: 'from-blue-400 to-blue-600' },
    { emoji: '😡', label: 'Angry', color: 'from-red-400 to-red-600' },
    { emoji: '😴', label: 'Tired', color: 'from-purple-400 to-purple-600' },
    { emoji: '😰', label: 'Anxious', color: 'from-orange-400 to-orange-600' },
    { emoji: '🤩', label: 'Excited', color: 'from-pink-400 to-pink-600' },
    { emoji: '😌', label: 'Relaxed', color: 'from-teal-400 to-teal-600' }
  ];

  const commonTags = ['Work', 'Family', 'Friends', 'Health', 'Weather', 'Exercise', 'Sleep', 'Food'];

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim()) && tags.length < 5) {
      setTags([...tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }

    try {
      const fullNotes = `${notes} ${tags.map(tag => `#${tag}`).join(' ')}`.trim();
      await addMoodEntry(selectedMood, fullNotes, intensity);
      
      // Reset form
      setSelectedMood('');
      setNotes('');
      setIntensity(5);
      setTags([]);
      onClose();
      
      // Show success feedback
      alert(`✅ ${selectedMood} mood recorded!`);
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      alert('Failed to save mood entry');
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
          <div className="grid grid-cols-4 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(`${mood.emoji} ${mood.label}`)}
                className={`p-3 rounded-xl transition-all ${
                  selectedMood === `${mood.emoji} ${mood.label}`
                    ? `bg-gradient-to-br ${mood.color} text-white transform scale-105 shadow-lg`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
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
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Tags */}
        <div className="p-6 border-t">
          <h3 className="font-semibold mb-3 text-gray-700">Add tags (optional)</h3>
          
          {/* Common Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {commonTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                disabled={tags.includes(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  tags.includes(tag)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
          
          {/* Custom Tag Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Add custom tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
            />
            <button
              onClick={handleAddCustomTag}
              disabled={!customTag.trim() || tags.length >= 5}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {/* Selected Tags Display */}
          {tags.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200">
                    <Hash size={12} className="mr-1" />
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)} 
                      className="ml-1 hover:text-blue-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="p-6 border-t">
          <h3 className="font-semibold mb-3 text-gray-700">Notes (optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's influencing your mood today?"
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
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save Mood
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodModal;
