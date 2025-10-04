import React, { useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import QuickActions from './QuickActions';
import MoodHistory from './MoodHistory';
import MoodReport from './MoodReport';
import StatsCards from './StatsCards';
import { AIAssistant } from './AIAssistant/AIAssistant';
import { Brain, Activity, TrendingUp, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { fetchMoodEntries, loading, moodEntries, stats } = useMood();

  // Fetch data when dashboard loads
  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  if (loading && moodEntries.length === 0) {
    return (
      <div className="cyber-dashboard flex items-center justify-center">
        <div className="cyber-card p-8 text-center">
          <div className="cyber-spinner mx-auto mb-4"></div>
          <p className="cyber-text-glow">Initializing neural interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-dashboard py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cyberpunk Header */}
        <div className="mb-12 text-center animate-cyber-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-cyber-primary mr-4 animate-cyber-float" />
            <h1 className="cyber-heading text-4xl md:text-6xl">
              MOOD MATRIX
            </h1>
            <Zap className="w-12 h-12 text-cyber-accent ml-4 animate-cyber-pulse" />
          </div>
          <p className="text-cyber-text-muted text-lg md:text-xl max-w-2xl mx-auto">
            {moodEntries.length > 0 
              ? `Neural patterns detected: ${moodEntries.length} entries • ${stats.currentStreak} day streak`
              : 'Awaiting neural input... Begin your journey'
            }
          </p>
          <div className="cyber-divider mt-6"></div>
        </div>

        {/* Cyberpunk Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-cyber-slide">
              <QuickActions />
            </div>
            <div className="animate-cyber-slide" style={{ animationDelay: '0.2s' }}>
              <StatsCards />
            </div>
            <div className="animate-cyber-slide" style={{ animationDelay: '0.4s' }}>
              <MoodHistory />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="animate-cyber-slide" style={{ animationDelay: '0.6s' }}>
              <MoodReport />
            </div>
            
            {/* Cyberpunk Status Panel */}
            <div className="cyber-card p-6 animate-cyber-slide" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center mb-4">
                <Activity className="w-6 h-6 text-cyber-primary mr-3" />
                <h3 className="cyber-text text-lg font-bold">System Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyber-text-muted text-sm">Neural Link</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-cyber-pulse"></div>
                    <span className="text-cyber-primary text-sm font-mono">ACTIVE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyber-text-muted text-sm">Data Sync</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyber-accent rounded-full mr-2"></div>
                    <span className="text-cyber-accent text-sm font-mono">SYNCED</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyber-text-muted text-sm">Memory Core</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyber-secondary rounded-full mr-2"></div>
                    <span className="text-cyber-secondary text-sm font-mono">STABLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cyberpunk Quick Stats */}
            <div className="cyber-card p-6 animate-cyber-slide" style={{ animationDelay: '1s' }}>
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-cyber-accent mr-3" />
                <h3 className="cyber-text text-lg font-bold">Quick Stats</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-cyber-text-muted text-sm">Today's Entries</span>
                    <span className="text-cyber-primary text-sm font-mono">
                      {moodEntries.filter(entry => 
                        new Date(entry.date).toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                  <div className="cyber-progress h-2">
                    <div 
                      className="cyber-progress-bar" 
                      style={{ 
                        width: `${Math.min(100, (moodEntries.filter(entry => 
                          new Date(entry.date).toDateString() === new Date().toDateString()
                        ).length / 5) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-cyber-text-muted text-sm">Weekly Average</span>
                    <span className="text-cyber-accent text-sm font-mono">
                      {moodEntries.length > 0 
                        ? (moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length).toFixed(1)
                        : '0.0'
                      }/5
                    </span>
                  </div>
                  <div className="cyber-progress h-2">
                    <div 
                      className="cyber-progress-bar" 
                      style={{ 
                        width: `${moodEntries.length > 0 
                          ? (moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length / 5) * 100
                          : 0
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Dashboard;