import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { ColorfulMoodIndicator } from './ColorfulMoodIndicator';

const MoodReport: React.FC = () => {
  const { moodEntries } = useMood();

  const generateReport = () => {
    if (moodEntries.length === 0) {
      return {
        totalEntries: 0,
        averageMood: 0,
        mostCommonMoodScore: 0,
        moodDistribution: {},
        recentTrend: 'stable',
        averageMoodLabel: 'No data'
      };
    }

    // Calculate mood distribution by score
    const moodDistribution: { [key: number]: number } = {};
    let totalScore = 0;
    
    moodEntries.forEach(entry => {
      const score = entry.mood_score;
      moodDistribution[score] = (moodDistribution[score] || 0) + 1;
      totalScore += score;
    });

    // Calculate average mood
    const averageMood = totalScore / moodEntries.length;

    // Find most common mood score
    const mostCommonMoodScore = Object.entries(moodDistribution)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Calculate recent trend (last 7 days vs previous 7 days)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentEntries = moodEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );
    const previousEntries = moodEntries.filter(entry => 
      new Date(entry.date) >= twoWeeksAgo && new Date(entry.date) < oneWeekAgo
    );

    const recentAvg = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / recentEntries.length 
      : 0;
    const previousAvg = previousEntries.length > 0 
      ? previousEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / previousEntries.length 
      : 0;
    
    let trend = 'stable';
    if (recentAvg > previousAvg + 0.3) trend = 'improving';
    else if (recentAvg < previousAvg - 0.3) trend = 'declining';

    return {
      totalEntries: moodEntries.length,
      averageMood,
      mostCommonMoodScore: parseInt(mostCommonMoodScore),
      moodDistribution,
      recentTrend: trend,
      averageMoodLabel: getMoodLabel(averageMood)
    };
  };

  const report = generateReport();

  const downloadReport = () => {
    const reportData = `
Mood Tracking Report
Generated on: ${new Date().toLocaleDateString()}

Total Entries: ${report.totalEntries}
Average Mood: ${report.averageMood.toFixed(1)}/5 (${report.averageMoodLabel})
Most Common Mood: ${getMoodLabel(report.mostCommonMoodScore)} (${report.mostCommonMoodScore}/5)
Recent Trend: ${report.recentTrend}

Mood Distribution:
${Object.entries(report.moodDistribution)
  .sort(([a], [b]) => parseInt(b) - parseInt(a))
  .map(([score, count]) => `  ${getMoodLabel(parseInt(score))} (${score}/5): ${count} entries (${Math.round((count / report.totalEntries) * 100)}%)`)
  .join('\n')}

Thank you for using Moody!
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Mood Report</h2>
      
      {report.totalEntries === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 text-lg">No data available for report</p>
          <p className="text-gray-400 text-sm mt-2">Start tracking your mood to generate reports!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Total Entries</h3>
              <p className="text-2xl font-bold text-blue-600">{report.totalEntries}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Average Mood</h3>
              <div className="flex items-center space-x-2">
                <ColorfulMoodIndicator score={Math.round(report.averageMood)} size="sm" showLabel={false} />
                <p className="text-2xl font-bold text-green-600">{report.averageMood.toFixed(1)}/5</p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Trend</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {report.recentTrend === 'improving' ? '📈' : 
                   report.recentTrend === 'declining' ? '📉' : '➡️'}
                </span>
                <p className="text-2xl font-bold text-purple-600 capitalize">{report.recentTrend}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Mood Distribution</h3>
            <div className="space-y-3">
              {Object.entries(report.moodDistribution)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([score, count]) => (
                <div key={score} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center space-x-3">
                    <ColorfulMoodIndicator score={parseInt(score)} size="sm" showLabel={false} />
                    <span className="font-medium text-gray-800">{getMoodLabel(parseInt(score))}</span>
                    <span className="text-sm text-gray-500">({score}/5)</span>
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">{count}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round((count / report.totalEntries) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={downloadReport}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Full Report</span>
          </button>
        </>
      )}
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
