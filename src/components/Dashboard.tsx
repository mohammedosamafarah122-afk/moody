import React, { useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import QuickActions from './QuickActions';
import MoodHistory from './MoodHistory';
import MoodReport from './MoodReport';
import StatsCards from './StatsCards';
import { LoadingSpinner } from './LoadingSpinner';

const Dashboard: React.FC = () => {
  const { fetchMoodEntries, loading, moodEntries, stats } = useMood();

  // Fetch data when dashboard loads
  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  if (loading && moodEntries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mood Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {moodEntries.length > 0 
              ? `Tracking ${moodEntries.length} mood entries • ${stats.currentStreak} day streak`
              : 'Start tracking your mood journey'
            }
                          </p>
                        </div>

        <div className="space-y-8">
                    <QuickActions />
          <StatsCards />
          <MoodHistory />
          <MoodReport />
                  </div>
                </div>
    </div>
  );
};

export default Dashboard;