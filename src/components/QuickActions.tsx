import React from 'react'

export const QuickActions: React.FC = () => {
  const handleAddMood = () => {
    // Navigate to mood logging or open modal
    console.log('Add mood entry clicked')
  }

  const handleViewHistory = () => {
    // Navigate to calendar view
    console.log('View history clicked')
  }

  const handleGenerateReport = () => {
    // Navigate to analytics or generate report
    console.log('Generate report clicked')
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="flex space-x-4">
        <button 
          onClick={handleAddMood}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Add Mood Entry
        </button>
        <button 
          onClick={handleViewHistory}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        >
          View History
        </button>
        <button 
          onClick={handleGenerateReport}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
        >
          Generate Report
        </button>
      </div>
    </div>
  )
}