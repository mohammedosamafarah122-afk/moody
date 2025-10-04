import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { X, Zap, Brain, Activity } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodModal: React.FC<MoodModalProps> = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addMoodEntry } = useMood();

  const moodOptions = [
    { emoji: '😊', label: 'Happy', score: 5, color: 'cyber-primary', description: 'Positive neural patterns detected' },
    { emoji: '😐', label: 'Neutral', score: 3, color: 'cyber-accent', description: 'Baseline neural activity' },
    { emoji: '😔', label: 'Sad', score: 2, color: 'cyber-secondary', description: 'Low frequency patterns' },
    { emoji: '😡', label: 'Angry', score: 1, color: 'red-500', description: 'High intensity signals' },
    { emoji: '😴', label: 'Tired', score: 2, color: 'purple-500', description: 'Reduced neural activity' },
  ];

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Attempting to save mood:', { selectedMood, notes, intensity });
      await addMoodEntry(
        moodOptions.find(m => m.score === selectedMood)?.label || 'Unknown',
        notes,
        intensity
      );
      console.log('Save successful');
      
      setSelectedMood(null);
      setNotes('');
      setIntensity(5);
      onClose();
      alert('✅ Mood saved successfully!');
    } catch (error: any) {
      console.error('Save failed:', error);
      alert(`❌ Failed to save mood: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="cyber-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Cyberpunk Header */}
        <div className="flex justify-between items-center p-6 border-b border-cyber-border">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-cyber-primary mr-3" />
            <h2 className="cyber-text text-xl font-bold">Neural Input Interface</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-cyber-surface rounded-lg transition-all duration-300 hover:shadow-cyber-glow"
          >
            <X size={20} className="text-cyber-text-muted hover:text-cyber-primary" />
          </button>
        </div>

        {/* Mood Selection */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-cyber-accent mr-2" />
            <h3 className="cyber-label">Select Neural Pattern</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.label}
                 onClick={() => setSelectedMood(mood.score)}
                 className={`cyber-mood-indicator ${
                   selectedMood === mood.score ? 'selected' : ''
                 }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium text-cyber-text">{mood.label}</div>
                <div className="text-xs text-cyber-text-muted mt-1">{mood.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="p-6 border-t border-cyber-border">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-cyber-primary mr-2" />
              <h3 className="cyber-label">Neural Intensity</h3>
            </div>
            <span className="text-cyber-accent text-sm font-mono">{intensity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="cyber-slider w-full"
          />
          <div className="flex justify-between text-xs text-cyber-text-muted mt-2">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Notes */}
        <div className="p-6 border-t border-cyber-border">
          <h3 className="cyber-label mb-3">Neural Notes (Optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record additional neural patterns..."
            className="cyber-textarea w-full"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-cyber-border flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="cyber-btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className="cyber-btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="cyber-spinner w-4 h-4"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Save Pattern
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodModal;