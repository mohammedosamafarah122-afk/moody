import React from 'react';
import { useMood } from '../contexts/MoodContext';

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
      color: 'bg-blue-50 border-blue-100 text-blue-600'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'bg-green-50 border-green-100 text-green-600'
    },
    {
      title: 'Avg Intensity',
      value: `${stats.averageIntensity}/10`,
      color: 'bg-purple-50 border-purple-100 text-purple-600'
    },
    {
      title: 'Weekly Avg',
      value: `${stats.weeklyAverage}/10`,
      color: 'bg-orange-50 border-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.title} className={`bg-white p-6 rounded-2xl shadow-sm border ${card.color}`}>
          <p className="text-2xl font-bold mb-1">{card.value}</p>
          <p className="text-sm font-medium opacity-70">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;