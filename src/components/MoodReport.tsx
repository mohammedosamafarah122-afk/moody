import React, { useState, useMemo } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Download, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

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
MOODY - MOOD TRACKING REPORT
Generated on: ${new Date().toLocaleDateString()}
Time Range: ${dateRange === 'all' ? 'All Time' : dateRange === 'week' ? 'Past Week' : 'Past Month'}

SUMMARY:
• Total Entries: ${report.totalEntries}
• Most Common Mood: ${report.mostCommonMood}
• Average Mood Score: ${report.averageMoodScore}/5
• Average Intensity: ${report.averageIntensity}/10
• Current Streak: ${report.streak} days
• Trend: ${report.trend}

MOOD DISTRIBUTION:
${Object.entries(report.moodDistribution)
  .map(([mood, count]) => `  ${mood}: ${count} entries (${Math.round((count / report.totalEntries) * 100)}%)`)
  .join('\n')}

${report.insights.length > 0 ? `INSIGHTS:\n${report.insights.map(insight => `• ${insight}`).join('\n')}` : ''}

Thank you for using Moody to track your emotional well-being!
    `.trim();

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTrendIcon = () => {
    switch (report.trend) {
      case 'improving': return <TrendingUp size={20} className="text-green-500" />;
      case 'declining': return <TrendingDown size={20} className="text-red-500" />;
      default: return <Minus size={20} className="text-yellow-500" />;
    }
  };

  const getMoodEmoji = (moodLabel: string) => {
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Generating your report...</span>
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
            <h2 className="text-xl font-bold text-gray-800">Mood Analytics</h2>
            <p className="text-gray-600 text-sm mt-1">Insights from your mood tracking journey</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Time</option>
              <option value="month">Past Month</option>
              <option value="week">Past Week</option>
            </select>
            
            <button
              onClick={downloadReport}
              disabled={report.totalEntries === 0}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {report.totalEntries === 0 ? (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No data available</h3>
            <p className="text-gray-500">Start tracking your mood to generate reports.</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Total Entries</h3>
                <p className="text-2xl font-bold text-blue-600">{report.totalEntries}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h3 className="text-sm font-medium text-green-800 mb-1">Common Mood</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getMoodEmoji(report.mostCommonMood)}</span>
                  <p className="text-sm font-bold text-green-600 truncate" title={report.mostCommonMood}>
                    {report.mostCommonMood}
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h3 className="text-sm font-medium text-purple-800 mb-1">Avg Mood</h3>
                <p className="text-2xl font-bold text-purple-600">{report.averageMoodScore}/5</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="text-sm font-medium text-indigo-800 mb-1">Avg Intensity</h3>
                <p className="text-2xl font-bold text-indigo-600">{report.averageIntensity}/10</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h3 className="text-sm font-medium text-orange-800 mb-1">Current Streak</h3>
                <p className="text-2xl font-bold text-orange-600">{report.streak} days</p>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                <h3 className="text-sm font-medium text-teal-800 mb-1">Trend</h3>
                <div className="flex items-center gap-2">
                  {getTrendIcon()}
                  <span className={`text-sm font-bold capitalize ${
                    report.trend === 'improving' ? 'text-green-600' : 
                    report.trend === 'declining' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {report.trend}
                  </span>
                </div>
              </div>
            </div>

            {/* Mood Distribution Chart */}
            <div className="bg-gray-50 p-6 rounded-2xl mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Mood Distribution</h3>
              <div className="space-y-3">
                {Object.entries(report.moodDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([mood, count]) => {
                    const percentage = (count / report.totalEntries) * 100;
                    return (
                      <div key={mood} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-2xl">{getMoodEmoji(mood)}</span>
                          <span className="text-sm font-medium text-gray-700 flex-1">{mood}</span>
                          <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
                        </div>
                        <div className="w-32">
                          <div className="bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Insights */}
            {report.insights.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-3">Personal Insights</h3>
                <ul className="space-y-2" style={{ listStyle: 'none', padding: 0 }}>
                  {report.insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-3" style={{ marginBottom: '8px' }}>
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" style={{ marginRight: '8px' }}></div>
                      <p className="text-gray-700">{insight}</p>
                    </li>
                  ))}
                </ul>
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