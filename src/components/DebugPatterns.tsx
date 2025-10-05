import React from 'react';
import { useMood } from '../contexts/MoodContext';

export const DebugPatterns: React.FC = () => {
  const { moodEntries, loading } = useMood();

  if (loading) {
    return <div>Loading debug data...</div>;
  }

  // Extract all hashtags from journal entries
  const extractHashtags = (journalEntry: string = '') => {
    const hashtagMatches = journalEntry.match(/#(\w+)/g) || [];
    return hashtagMatches.map(match => match.substring(1));
  };

  // Count all hashtags
  const allHashtags = moodEntries.reduce((acc, entry) => {
    const hashtags = extractHashtags(entry.journal_entry);
    hashtags.forEach(hashtag => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Get entries with hashtags
  const entriesWithHashtags = moodEntries.filter(entry => 
    entry.journal_entry && entry.journal_entry.includes('#')
  );

  return (
    <div className="cyber-card p-6 m-4">
      <h2 className="cyber-text text-2xl font-bold mb-4">🔍 Pattern Debug Info</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-cyber-primary mb-2">Database Stats</h3>
          <p>Total entries: {moodEntries.length}</p>
          <p>Entries with hashtags: {entriesWithHashtags.length}</p>
          <p>Unique hashtags found: {Object.keys(allHashtags).length}</p>
        </div>

        {Object.keys(allHashtags).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-cyber-accent mb-2">Hashtag Counts</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(allHashtags)
                .sort(([, a], [, b]) => b - a)
                .map(([hashtag, count]) => (
                  <div key={hashtag} className="bg-cyber-surface p-2 rounded border border-cyber-border">
                    <span className="text-cyber-primary">#{hashtag}</span>
                    <span className="text-cyber-text-muted ml-2">({count})</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {entriesWithHashtags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-cyber-secondary mb-2">Recent Entries with Hashtags</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {entriesWithHashtags.slice(0, 10).map((entry) => (
                <div key={entry.id} className="bg-cyber-surface p-3 rounded border border-cyber-border">
                  <div className="text-sm text-cyber-text-muted">
                    {new Date(entry.date).toLocaleDateString()} - Mood: {entry.mood_score}
                  </div>
                  <div className="text-cyber-text mt-1">
                    {entry.journal_entry}
                  </div>
                  <div className="text-xs text-cyber-accent mt-1">
                    Hashtags: {extractHashtags(entry.journal_entry).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {entriesWithHashtags.length === 0 && (
          <div className="text-center py-8">
            <p className="text-cyber-text-muted">No entries with hashtags found.</p>
            <p className="text-sm text-cyber-text-muted mt-2">
              Try logging a mood with emotions and activities selected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
