import React, { useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import QuickActions from './QuickActions';
import MoodHistory from './MoodHistory';
import MoodReport from './MoodReport';
import { StatsCards } from './StatsCards';

const Dashboard: React.FC = () => {
  const { fetchMoodEntries } = useMood();

  // Fetch data when dashboard loads
  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mood Dashboard</h1>
          <p className="text-gray-600 mt-2">Track and analyze your emotional well-being</p>
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