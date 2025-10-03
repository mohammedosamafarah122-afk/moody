import React, { useState, useMemo } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Calendar, Search } from 'lucide-react';

const MoodHistory: React.FC = () => {
  const { moodEntries, loading } = useMood();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const filteredEntries = useMemo(() => {
    return moodEntries.filter(entry => {
      const matchesSearch = entry.journal_entry?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           getMoodLabel(entry.mood_score).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = selectedMood === 'all' || getMoodLabel(entry.mood_score) === selectedMood;
      
      const entryDate = new Date(entry.date);
      const now = new Date();
      let matchesDate = true;
      
      if (dateRange === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = entryDate >= oneWeekAgo;
      } else if (dateRange === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        matchesDate = entryDate >= oneMonthAgo;
      }
      
      return matchesSearch && matchesMood && matchesDate;
    });
  }, [moodEntries, searchTerm, selectedMood, dateRange]);

  const getMoodColor = (moodScore: number) => {
    const colorMap: { [key: number]: string } = {
      1: 'bg-red-100 text-red-800 border-red-200',
      2: 'bg-orange-100 text-orange-800 border-orange-200',
      3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      4: 'bg-green-100 text-green-800 border-green-200',
      5: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colorMap[moodScore] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading your mood history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Mood History</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-48"
              />
            </div>
            
            {/* Mood Filter */}
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Moods</option>
              <option value="Terrible">😢 Terrible</option>
              <option value="Poor">😔 Poor</option>
              <option value="Okay">😐 Okay</option>
              <option value="Good">😊 Good</option>
              <option value="Excellent">🤩 Excellent</option>
            </select>
            
            {/* Date Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="p-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No entries found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {moodEntries.length === 0 
                ? "Start tracking your mood to see your history here."
                : "Try adjusting your filters to see more entries."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start space-x-4 flex-1">
                    <span className="text-3xl flex-shrink-0">{getMoodEmoji(entry.mood_score)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMoodColor(entry.mood_score)}`}>
                          {getMoodLabel(entry.mood_score)} ({entry.mood_score}/5)
                        </span>
                        {entry.intensity && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            Intensity: {entry.intensity}/10
                          </span>
                        )}
                      </div>
                      {entry.journal_entry && (
                        <p className="text-gray-700 leading-relaxed">{entry.journal_entry}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>{new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                        <span>{new Date(entry.created_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
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

export default MoodHistory;
