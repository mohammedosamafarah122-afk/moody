import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { ColorfulMoodIndicator } from './ColorfulMoodIndicator';

const MoodHistory: React.FC = () => {
  const { moodEntries, loading } = useMood();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Mood History</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading mood history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Mood History</h2>
      
      {moodEntries.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">😊</div>
          <p className="text-gray-500 text-lg">No mood entries yet.</p>
          <p className="text-gray-400 text-sm mt-2">Start tracking your mood to see your history here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {moodEntries.map((entry) => (
            <div key={entry.id} className="border-b border-gray-200 pb-4 last:border-b-0 hover:bg-gray-50 rounded-lg p-3 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <ColorfulMoodIndicator 
                    score={entry.mood_score} 
                    size="md" 
                    showLabel={false} 
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {getMoodLabel(entry.mood_score)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.emotions.slice(0, 3).map((emotion) => (
                          <span 
                            key={emotion}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {entry.mood_score}/5
                  </div>
                  {entry.journal_entry && (
                    <p className="text-gray-600 text-sm mt-2 max-w-xs text-right italic">
                      "{entry.journal_entry.length > 100 
                        ? entry.journal_entry.substring(0, 100) + '...' 
                        : entry.journal_entry}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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

export default MoodHistory;
