import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { BarChart3, TrendingUp, Zap, Target } from 'lucide-react';

const StatsCards: React.FC = () => {
  const { stats, loading } = useMood();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="cyber-card p-6 animate-pulse">
            <div className="h-4 bg-cyber-border rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-cyber-border rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-cyber-border rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { 
      title: 'Total Entries', 
      value: stats.totalEntries.toString(), 
      icon: BarChart3,
      color: 'cyber-primary',
      description: 'Neural patterns recorded'
    },
    { 
      title: 'Current Streak', 
      value: `${stats.currentStreak} days`, 
      icon: TrendingUp,
      color: 'cyber-accent',
      description: 'Consecutive days'
    },
    { 
      title: 'Avg Intensity', 
      value: `${stats.averageIntensity}/10`, 
      icon: Zap,
      color: 'cyber-secondary',
      description: 'Neural intensity'
    },
    { 
      title: 'Weekly Avg', 
      value: `${stats.weeklyAverage}/10`, 
      icon: Target,
      color: 'green-500',
      description: '7-day average'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={card.title} 
            className="cyber-stat-card group hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon and Title */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${card.color} bg-opacity-20 mr-3`}>
                  <IconComponent className={`w-6 h-6 text-${card.color}`} />
                </div>
                <div>
                  <h3 className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">
                    {card.title}
                  </h3>
                  <p className="text-cyber-text-muted text-xs">{card.description}</p>
                </div>
              </div>
            </div>

            {/* Value */}
            <div className="mb-4">
              <p className="cyber-text text-3xl font-bold font-mono">
                {card.value}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="cyber-progress h-2">
              <div 
                className="cyber-progress-bar" 
                style={{ 
                  width: `${Math.min(100, (parseFloat(card.value) / 10) * 100)}%` 
                }}
              ></div>
            </div>

            {/* Cyberpunk Glow Effect */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${card.color} to-transparent opacity-10`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;