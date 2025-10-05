import React, { useState, useMemo, useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Calendar, Search, Brain, Filter, Clock, Zap, Activity } from 'lucide-react';
import { getMoodEmoji } from '../constants/moodEmojis';

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
      1: 'bg-red-500 bg-opacity-20 text-red-400 border-red-500',
      2: 'bg-orange-500 bg-opacity-20 text-orange-400 border-orange-500',
      3: 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500',
      4: 'bg-cyber-primary bg-opacity-20 text-cyber-primary border-cyber-primary',
      5: 'bg-cyber-accent bg-opacity-20 text-cyber-accent border-cyber-accent',
    };
    return colorMap[moodScore] || 'bg-cyber-border bg-opacity-20 text-cyber-text-muted border-cyber-border';
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
      <div className="cyber-card p-8">
        <div className="flex items-center justify-center">
          <div className="cyber-spinner mr-4"></div>
          <span className="text-cyber-text-muted">Loading neural patterns...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-card">
      {/* Cyberpunk Header */}
      <div className="p-6 border-b border-cyber-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-cyber-primary mr-3" />
            <div>
              <h2 className="cyber-text text-2xl font-bold">Neural History</h2>
              <p className="text-cyber-text-muted text-sm mt-1">
                {filteredEntries.length} {filteredEntries.length === 1 ? 'pattern' : 'patterns'} detected
              </p>
            </div>
          </div>
        </div>

        {/* Cyberpunk Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-text-muted" />
            <input
              type="text"
              placeholder="Search neural patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input pl-10 w-full"
            />
          </div>

          {/* Mood Filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-text-muted" />
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="cyber-select pl-10 w-full"
            >
              <option value="all">All Patterns</option>
              <option value="Terrible">😢 Terrible</option>
              <option value="Poor">😔 Poor</option>
              <option value="Okay">😐 Okay</option>
              <option value="Good">😊 Good</option>
              <option value="Excellent">🤩 Excellent</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-text-muted" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="cyber-select pl-10 w-full"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="p-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <Calendar size={64} className="mx-auto text-cyber-border mb-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-cyber-primary animate-cyber-pulse" />
              </div>
            </div>
            <h3 className="cyber-text text-xl font-bold mb-2">
              {moodEntries.length === 0 ? "No neural patterns detected" : "No patterns match your filters"}
            </h3>
            <p className="text-cyber-text-muted max-w-sm mx-auto">
              {moodEntries.length === 0 
                ? "Begin recording your neural patterns to see your history here."
                : "Try adjusting your search or filters to see more patterns."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="cyber-card p-6 hover:scale-[1.02] transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Mood Emoji */}
                    <div className="relative">
                      <span className="text-4xl flex-shrink-0 group-hover:animate-cyber-float">
                        {getMoodEmoji(entry.mood_score)}
                      </span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Mood Badge and Intensity */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`cyber-badge ${getMoodColor(entry.mood_score)}`}>
                          {getMoodLabel(entry.mood_score)} ({entry.mood_score}/5)
                        </span>
                        {entry.intensity && (
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-cyber-accent" />
                            <span className="text-cyber-accent text-sm font-mono">
                              {entry.intensity}/10
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Journal Entry */}
                      {entry.journal_entry && (
                        <div className="mb-4">
                          <p className="text-cyber-text leading-relaxed bg-cyber-surface p-3 rounded-lg border border-cyber-border">
                            {entry.journal_entry}
                          </p>
                        </div>
                      )}

                      {/* Date and Time */}
                      <div className="flex items-center gap-4 text-sm text-cyber-text-muted">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(entry.date)}</span>
                        </div>
                        {entry.created_at && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                              {new Date(entry.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 text-cyber-primary mr-2" />
                      <span className="text-cyber-primary text-xs font-mono">RECORDED</span>
                    </div>
                    <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-cyber-text-muted mb-1">
                    <span>Neural Intensity</span>
                    <span>{entry.mood_score}/5</span>
                  </div>
                  <div className="cyber-progress h-2">
                    <div 
                      className="cyber-progress-bar" 
                      style={{ width: `${(entry.mood_score / 5) * 100}%` }}
                    ></div>
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