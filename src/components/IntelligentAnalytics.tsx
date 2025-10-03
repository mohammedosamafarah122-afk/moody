import React from 'react'

export const IntelligentAnalytics: React.FC = () => {
  const insights = [
    {
      title: "Weekly Pattern",
      description: "Your mood tends to be higher on weekends",
      icon: "📅",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Activity Impact",
      description: "Exercise correlates with 23% higher mood scores",
      icon: "💪", 
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Sleep Connection",
      description: "Better sleep quality improves your mood by 15%",
      icon: "😴",
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Social Time",
      description: "Social activities boost your mood significantly",
      icon: "👥",
      color: "from-pink-500 to-rose-500"
    }
  ]

  const recommendations = [
    "Try to maintain a consistent sleep schedule",
    "Include 30 minutes of exercise in your daily routine", 
    "Plan social activities for weekends",
    "Consider meditation for stress management"
  ]

  return (
    <div className="space-y-6">
      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center text-white text-lg`}>
                {insight.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <span className="text-lg">💡</span>
          <span>Smart Recommendations</span>
        </h4>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
              <span className="text-purple-500 mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}