import React from 'react';
import type { MoodEntry } from '../lib/supabase';

interface MoodChartsProps {
  moodEntries: MoodEntry[];
}

const MoodCharts: React.FC<MoodChartsProps> = ({ moodEntries }) => {
  // Mood distribution data
  const moodDistribution = moodEntries.reduce((acc, entry) => {
    const moodLabel = getMoodLabel(entry.mood_score);
    acc[moodLabel] = (acc[moodLabel] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Weekly trend data (last 4 weeks)
  const getWeeklyTrend = () => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekLabel = `Week ${i === 0 ? 'Current' : i}`;
      const weekEntries = moodEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000) && 
               entryDate < startDate;
      });
      weeks.push({ label: weekLabel, count: weekEntries.length });
    }
    
    return weeks;
  };

  const weeklyTrend = getWeeklyTrend();
  const maxCount = Math.max(...weeklyTrend.map(w => w.count), 1);

  const getMoodEmoji = (moodScore: number) => {
    const emojiMap: { [key: number]: string } = {
      1: '😢',
      2: '😔',
      3: '😐',
      4: '😊',
      5: '🤩',
    };
    return emojiMap[moodScore] || '😐';
  };

  const getMoodColor = (moodScore: number) => {
    const colorMap: { [key: number]: string } = {
      1: 'from-red-500 to-red-600',
      2: 'from-orange-500 to-orange-600',
      3: 'from-yellow-500 to-yellow-600',
      4: 'from-green-500 to-green-600',
      5: 'from-blue-500 to-blue-600',
    };
    return colorMap[moodScore] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Mood Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Mood Distribution</h3>
        {moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500">No mood data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(moodDistribution)
              .sort(([,a], [,b]) => b - a)
              .map(([mood, count]) => {
                const moodScore = getMoodScoreFromLabel(mood);
                const percentage = (count / moodEntries.length) * 100;
                return (
                  <div key={mood} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{getMoodEmoji(moodScore)}</span>
                      <span className="text-sm font-medium text-gray-700 flex-1">{mood}</span>
                    </div>
                    <div className="flex items-center space-x-3 w-32">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${getMoodColor(moodScore)} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8 text-right">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Weekly Trend */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Trend</h3>
        {moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-gray-500">No trend data available</p>
          </div>
        ) : (
          <div className="flex items-end justify-between h-32 space-x-2">
            {weeklyTrend.map((week) => (
              <div key={week.label} className="flex-1 flex flex-col items-center space-y-2">
                <div className="text-xs text-gray-500 text-center">{week.label}</div>
                <div className="flex-1 w-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t transition-all hover:from-blue-600 hover:to-purple-700"
                    style={{ height: `${(week.count / maxCount) * 80}%` }}
                  ></div>
                </div>
                <div className="text-sm font-semibold text-gray-700">{week.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getMoodLabel = (moodScore: number) => {
  const moodLabels: { [key: number]: string } = {
    1: 'Terrible',
    2: 'Poor', 
    3: 'Okay',
    4: 'Good',
    5: 'Excellent',
  };
  return moodLabels[moodScore] || 'Unknown';
};

const getMoodScoreFromLabel = (label: string) => {
  const scoreMap: { [key: string]: number } = {
    'Terrible': 1,
    'Poor': 2,
    'Okay': 3,
    'Good': 4,
    'Excellent': 5,
  };
  return scoreMap[label] || 3;
};

export default MoodCharts;
