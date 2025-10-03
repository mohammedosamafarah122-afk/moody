import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Plus } from 'lucide-react';
import MoodModal from './MoodModal';

const QuickActions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addMoodEntry } = useMood();

  const handleQuickMood = async (mood: string) => {
    try {
      await addMoodEntry(mood, `Feeling ${mood}`);
      alert('Mood saved!');
    } catch (error) {
      alert('Failed to save mood');
    }
  };

  const quickMoods = [
    { emoji: '😊', label: 'Happy', bg: 'bg-green-500 hover:bg-green-600' },
    { emoji: '😐', label: 'Neutral', bg: 'bg-yellow-500 hover:bg-yellow-600' },
    { emoji: '😔', label: 'Sad', bg: 'bg-blue-500 hover:bg-blue-600' },
    { emoji: '😡', label: 'Angry', bg: 'bg-red-500 hover:bg-red-600' },
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {quickMoods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleQuickMood(`${mood.emoji} ${mood.label}`)}
              className={`${mood.bg} text-white p-4 rounded-xl transition-all flex flex-col items-center justify-center min-h-[80px]`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Detailed Entry
        </button>
      </div>

      <MoodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default QuickActions;