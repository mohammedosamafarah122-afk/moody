import React from 'react'

interface StatsCardsProps {
  totalEntries?: number
  averageMood?: string
  currentStreak?: number
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalEntries = 12,
  averageMood = '4.2',
  currentStreak = 7
}) => {
  const stats = [
    {
      title: "Average Mood",
      value: averageMood,
      color: "text-blue-600"
    },
    {
      title: "Entries This Week",
      value: totalEntries.toString(),
      color: "text-green-600"
    },
    {
      title: "Current Streak",
      value: `${currentStreak} days`,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">{stat.title}</h3>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
