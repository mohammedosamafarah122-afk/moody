import React, { useState, useMemo, useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Calendar, Search, Loader } from 'lucide-react';

const MoodHistory: React.FC = () => {
  const { moodEntries, loading, fetchMoodEntries } = useMood();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Fetch entries when component mounts
  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  const filteredEntries = useMemo(() => {
    let filtered = moodEntries;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.journal_entry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getMoodLabel(entry.mood_score).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply mood filter
    if (selectedMood !== 'all') {
      filtered = filtered.filter(entry => getMoodLabel(entry.mood_score) === selectedMood);
    }

    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      if (dateRange === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      } else {
        startDate = new Date(0); // Beginning of time
      }

      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate;
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <Loader className="animate-spin h-6 w-6 text-blue-500 mr-3" />
          <span className="text-gray-600">Loading your mood history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header with Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Mood History</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
          </div>

          {/* Mood Filter */}
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-[140px]"
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
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm min-w-[140px]"
          >
            <option value="all">All Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>
      </div>

      {/* Entries List */}
      <div className="p-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {moodEntries.length === 0 ? "No entries yet" : "No entries match your filters"}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {moodEntries.length === 0 
                ? "Start tracking your mood to see your history here."
                : "Try adjusting your search or filters to see more entries."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
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
                        <p className="text-gray-700 leading-relaxed mb-2">{entry.journal_entry}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(entry.date)}</span>
                        {entry.created_at && (
                          <span>
                            {new Date(entry.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
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