import React from 'react'

export const CalendarHeatmap: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Mood Calendar</h2>
      <div className="text-center text-gray-500">
        <p>Calendar heatmap will be displayed here</p>
        <div className="mt-4 p-8 bg-gray-100 rounded">
          Mood tracking calendar visualization
        </div>
      </div>
    </div>
  )
}