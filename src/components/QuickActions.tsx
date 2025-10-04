import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Plus, Zap, Brain, Activity } from 'lucide-react';
import MoodModal from './MoodModal';

const QuickActions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addMoodEntry } = useMood();

  const handleQuickMood = async (_moodScore: number, moodLabel: string) => {
    try {
      await addMoodEntry(`${moodLabel}`, `Quick mood entry: ${moodLabel}`);
      alert('✅ Neural pattern recorded!');
    } catch (error) {
      alert('❌ Failed to record pattern');
    }
  };

  const quickMoods = [
    { 
      emoji: '😊', 
      label: 'Happy', 
      score: 5,
      bg: 'bg-gradient-to-br from-cyber-primary to-cyber-accent',
      description: 'Positive vibes'
    },
    { 
      emoji: '😐', 
      label: 'Neutral', 
      score: 3,
      bg: 'bg-gradient-to-br from-cyber-accent to-blue-500',
      description: 'Baseline state'
    },
    { 
      emoji: '😔', 
      label: 'Sad', 
      score: 2,
      bg: 'bg-gradient-to-br from-cyber-secondary to-pink-500',
      description: 'Low energy'
    },
    { 
      emoji: '😡', 
      label: 'Angry', 
      score: 1,
      bg: 'bg-gradient-to-br from-red-500 to-orange-500',
      description: 'High intensity'
    },
  ];

  return (
    <>
      <div className="cyber-card p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Brain className="w-8 h-8 text-cyber-primary mr-3" />
          <div>
            <h2 className="cyber-text text-2xl font-bold">Quick Actions</h2>
            <p className="text-cyber-text-muted text-sm">Rapid neural pattern recording</p>
          </div>
        </div>

        {/* Quick Mood Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickMoods.map((mood) => (
            <button
              key={mood.label}
               onClick={() => handleQuickMood(mood.score, mood.label)}
              className={`${mood.bg} text-white p-6 rounded-xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] hover:scale-105 hover:shadow-cyber-glow group`}
            >
              <span className="text-4xl mb-2 group-hover:animate-cyber-float">{mood.emoji}</span>
              <span className="text-sm font-bold uppercase tracking-wider">{mood.label}</span>
              <span className="text-xs opacity-80 mt-1">{mood.description}</span>
            </button>
          ))}
        </div>

        {/* Detailed Entry Button */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="cyber-btn-primary w-full py-4 px-6 flex items-center justify-center gap-3 text-lg"
        >
          <Plus size={24} />
          <span>Advanced Neural Input</span>
          <Zap size={20} />
        </button>

        {/* Cyberpunk Status Indicator */}
        <div className="mt-6 p-4 bg-cyber-surface rounded-lg border border-cyber-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-cyber-accent mr-2" />
              <span className="text-cyber-text-muted text-sm">System Status</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-cyber-pulse"></div>
              <span className="text-cyber-primary text-sm font-mono">READY</span>
            </div>
          </div>
        </div>
      </div>

      <MoodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default QuickActions;