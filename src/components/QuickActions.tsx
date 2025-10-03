import React, { useState } from 'react';
import { Plus, BarChart3, History } from 'lucide-react';
import MoodModal from './MoodModal';

const QuickActions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              onClick={() => setIsModalOpen(true)}
              className={`${mood.bg} text-white p-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center min-h-[80px]`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Detailed Entry
          </button>
          
          <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium flex items-center gap-2">
            <History size={18} />
            History
          </button>
          
          <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium flex items-center gap-2">
            <BarChart3 size={18} />
            Report
          </button>
        </div>
      </div>

      <MoodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default QuickActions;