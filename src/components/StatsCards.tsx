import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { TrendingUp, Target, BarChart3, Heart } from 'lucide-react';

const StatsCards: React.FC = () => {
  const { stats, loading } = useMood();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Entries',
      value: stats.totalEntries.toString(),
      icon: BarChart3,
      color: 'blue',
      description: 'Mood entries tracked'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: TrendingUp,
      color: 'green',
      description: 'Consecutive days'
    },
    {
      title: 'Avg Intensity',
      value: `${stats.averageIntensity}/10`,
      icon: Target,
      color: 'purple',
      description: 'Emotional intensity'
    },
    {
      title: 'Most Common',
      value: stats.mostCommonMood,
      icon: Heart,
      color: 'orange',
      description: 'Frequent mood'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-100 text-blue-600',
      green: 'bg-green-50 border-green-100 text-green-600',
      purple: 'bg-purple-50 border-purple-100 text-purple-600',
      orange: 'bg-orange-50 border-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.title} className={`bg-white p-6 rounded-2xl shadow-sm border ${getColorClasses(card.color)}`}>
          <div className="flex items-center justify-between mb-3">
            <card.icon size={24} className="opacity-70" />
            <div className="text-right">
              <p className="text-2xl font-bold mb-1">{card.value}</p>
              <p className="text-sm font-medium opacity-70">{card.title}</p>
            </div>
          </div>
          <p className="text-xs opacity-60">{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;