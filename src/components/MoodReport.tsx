import React, { useState, useMemo } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Download, TrendingUp, TrendingDown, Minus, BarChart3, Brain, Zap, Activity, Target, Calendar } from 'lucide-react';

const MoodReport: React.FC = () => {
  const { moodEntries, loading } = useMood();
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'week'>('all');

  const filteredEntries = useMemo(() => {
    if (dateRange === 'all') return moodEntries;
    
    const now = new Date();
    let startDate: Date;

    if (dateRange === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else { // month
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }

    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    });
  }, [moodEntries, dateRange]);

  const report = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        totalEntries: 0,
        mostCommonMood: 'No data',
        averageIntensity: 0,
        moodDistribution: {},
        trend: 'stable' as const,
        streak: 0,
        insights: [] as string[]
      };
    }

    // Mood distribution based on mood_score
    const moodDistribution = filteredEntries.reduce((acc, entry) => {
      const moodLabel = getMoodLabel(entry.mood_score);
      acc[moodLabel] = (acc[moodLabel] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Most common mood
    const mostCommonMood = Object.entries(moodDistribution)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Average intensity
    const entriesWithIntensity = filteredEntries.filter(e => e.intensity);
    const averageIntensity = entriesWithIntensity.length > 0 
      ? Number((entriesWithIntensity.reduce((sum, e) => sum + (e.intensity || 0), 0) / entriesWithIntensity.length).toFixed(1))
      : 0;

    // Average mood score
    const averageMoodScore = Number((filteredEntries.reduce((sum, e) => sum + e.mood_score, 0) / filteredEntries.length).toFixed(1));

    // Trend calculation (based on mood score improvement)
    const sortedByDate = [...filteredEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const half = Math.floor(sortedByDate.length / 2);
    const firstHalf = sortedByDate.slice(0, half);
    const secondHalf = sortedByDate.slice(half);
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstHalfAvg = firstHalf.reduce((sum, e) => sum + e.mood_score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, e) => sum + e.mood_score, 0) / secondHalf.length;
      
      if (secondHalfAvg > firstHalfAvg + 0.3) trend = 'improving';
      else if (secondHalfAvg < firstHalfAvg - 0.3) trend = 'declining';
    }

    // Streak calculation
    let streak = 0;
    const today = new Date();
    const dates = new Set(filteredEntries.map(entry => entry.date));
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      if (dates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    // Generate insights
    const insights: string[] = [];
    if (streak >= 3) {
      insights.push(`You're on a ${streak}-day tracking streak! Keep it up.`);
    }
    if (Object.keys(moodDistribution).length >= 3) {
      insights.push("You're experiencing a diverse range of emotions.");
    }
    if (averageIntensity >= 7) {
      insights.push("You tend to feel emotions intensely.");
    } else if (averageIntensity <= 4) {
      insights.push("You generally experience mild emotional intensity.");
    }
    if (averageMoodScore >= 4) {
      insights.push("You're generally feeling positive overall.");
    } else if (averageMoodScore <= 2) {
      insights.push("Consider reaching out for support if you're feeling down.");
    }
    if (trend === 'improving') {
      insights.push("Your mood has been improving over time - great progress!");
    } else if (trend === 'declining') {
      insights.push("Your mood has been declining - consider self-care activities.");
    }

    return {
      totalEntries: filteredEntries.length,
      mostCommonMood,
      averageIntensity,
      averageMoodScore,
      moodDistribution,
      trend,
      streak,
      insights
    };
  }, [filteredEntries]);

  const downloadReport = () => {
    const reportData = `
MOODY - NEURAL PATTERN ANALYSIS REPORT
Generated on: ${new Date().toLocaleDateString()}
Time Range: ${dateRange === 'all' ? 'All Time' : dateRange === 'week' ? 'Past Week' : 'Past Month'}

NEURAL SUMMARY:
• Total Patterns: ${report.totalEntries}
• Most Common Pattern: ${report.mostCommonMood}
• Average Neural Score: ${report.averageMoodScore}/5
• Average Intensity: ${report.averageIntensity}/10
• Current Streak: ${report.streak} days
• Trend: ${report.trend}

PATTERN DISTRIBUTION:
${Object.entries(report.moodDistribution)
  .map(([mood, count]) => `  ${mood}: ${count} patterns (${Math.round((count / report.totalEntries) * 100)}%)`)
  .join('\n')}

${report.insights.length > 0 ? `NEURAL INSIGHTS:\n${report.insights.map(insight => `• ${insight}`).join('\n')}` : ''}

Thank you for using Moody to track your neural patterns!
    `.trim();

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTrendIcon = () => {
    switch (report.trend) {
      case 'improving': return <TrendingUp size={20} className="text-cyber-primary" />;
      case 'declining': return <TrendingDown size={20} className="text-cyber-secondary" />;
      default: return <Minus size={20} className="text-cyber-accent" />;
    }
  };

  const getMoodEmojiByLabel = (moodLabel: string) => {
    const emojiMap: { [key: string]: string } = {
      'Terrible': '😢',
      'Poor': '😔',
      'Okay': '😐',
      'Good': '😊',
      'Excellent': '🤩',
    };
    return emojiMap[moodLabel] || '😐';
  };

  if (loading) {
    return (
      <div className="cyber-card p-8">
        <div className="flex items-center justify-center">
          <div className="cyber-spinner mr-4"></div>
          <span className="text-cyber-text-muted">Analyzing neural patterns...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-card">
      {/* Cyberpunk Header */}
      <div className="p-6 border-b border-cyber-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-cyber-primary mr-3" />
            <div>
              <h2 className="cyber-text text-2xl font-bold">Neural Analytics</h2>
              <p className="text-cyber-text-muted text-sm mt-1">Insights from your neural pattern journey</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-text-muted" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="cyber-select pl-10"
              >
                <option value="all">All Time</option>
                <option value="month">Past Month</option>
                <option value="week">Past Week</option>
              </select>
            </div>
            
            <button
              onClick={downloadReport}
              disabled={report.totalEntries === 0}
              className="cyber-btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {report.totalEntries === 0 ? (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <BarChart3 size={64} className="mx-auto text-cyber-border mb-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-cyber-primary animate-cyber-pulse" />
              </div>
            </div>
            <h3 className="cyber-text text-xl font-bold mb-2">No neural data available</h3>
            <p className="text-cyber-text-muted">Start tracking your neural patterns to generate reports.</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="cyber-stat-card">
                <div className="flex items-center mb-3">
                  <Brain className="w-6 h-6 text-cyber-primary mr-2" />
                  <h3 className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Total Patterns</h3>
                </div>
                <p className="cyber-text text-3xl font-bold font-mono">{report.totalEntries}</p>
              </div>
              
              <div className="cyber-stat-card">
                <div className="flex items-center mb-3">
                  <Activity className="w-6 h-6 text-cyber-accent mr-2" />
                  <h3 className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Common Pattern</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmojiByLabel(report.mostCommonMood)}</span>
                  <p className="cyber-text text-lg font-bold truncate" title={report.mostCommonMood}>
                    {report.mostCommonMood}
                  </p>
                </div>
              </div>
              
              <div className="cyber-stat-card">
                <div className="flex items-center mb-3">
                  <Target className="w-6 h-6 text-cyber-secondary mr-2" />
                  <h3 className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Avg Score</h3>
                </div>
                <p className="cyber-text text-3xl font-bold font-mono">{report.averageMoodScore}/5</p>
              </div>
              
              <div className="cyber-stat-card">
                <div className="flex items-center mb-3">
                  <Zap className="w-6 h-6 text-cyber-accent mr-2" />
                  <h3 className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Avg Intensity</h3>
                </div>
                <p className="cyber-text text-3xl font-bold font-mono">{report.averageIntensity}/10</p>
              </div>

              <div className="cyber-stat-card">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 text-cyber-primary mr-2" />
                  <h3 className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Current Streak</h3>
                </div>
                <p className="cyber-text text-3xl font-bold font-mono">{report.streak} days</p>
              </div>
              
              <div className="cyber-stat-card">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-6 h-6 text-cyber-accent mr-2" />
                  <h3 className="text-cyber-text-muted text-sm font-medium uppercase tracking-wider">Trend</h3>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon()}
                  <span className={`text-sm font-bold capitalize font-mono ${
                    report.trend === 'improving' ? 'text-cyber-primary' : 
                    report.trend === 'declining' ? 'text-cyber-secondary' : 'text-cyber-accent'
                  }`}>
                    {report.trend}
                  </span>
                </div>
              </div>
            </div>

            {/* Mood Distribution Chart */}
            <div className="cyber-card p-6 mb-6">
              <h3 className="cyber-text text-lg font-bold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Pattern Distribution
              </h3>
              <div className="space-y-4">
                {Object.entries(report.moodDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([mood, count]) => {
                    const percentage = (count / report.totalEntries) * 100;
                    return (
                      <div key={mood} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-2xl">{getMoodEmojiByLabel(mood)}</span>
                          <span className="text-cyber-text font-medium flex-1">{mood}</span>
                          <span className="text-cyber-text-muted text-sm w-12 text-right font-mono">{count}</span>
                        </div>
                        <div className="w-32">
                          <div className="cyber-progress h-3">
                            <div 
                              className="cyber-progress-bar" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-cyber-accent text-sm font-mono w-12 text-right">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Insights */}
            {report.insights.length > 0 && (
              <div className="cyber-card p-6">
                <h3 className="cyber-text text-lg font-bold mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Neural Insights
                </h3>
                <div className="space-y-3">
                  {report.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-cyber-primary rounded-full mt-2 flex-shrink-0 animate-cyber-pulse"></div>
                      <p className="text-cyber-text">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
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

export default MoodReport;