import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { X, Zap, Brain, Activity, Smile, BookOpen } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOTIONS = [
  'Happy', 'Sad', 'Angry', 'Anxious', 'Excited', 'Calm', 'Frustrated', 
  'Grateful', 'Lonely', 'Confident', 'Overwhelmed', 'Peaceful', 'Energetic', 'Tired'
]

const ACTIVITIES = [
  'Work', 'Exercise', 'Sleep', 'Socializing', 'Reading', 'Cooking', 'Gaming',
  'Music', 'Art', 'Nature', 'Learning', 'Cleaning', 'Shopping', 'Travel', 'Meditation'
]

const MoodModal: React.FC<MoodModalProps> = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addMoodEntry } = useMood();

  const moodOptions = [
    { emoji: '😄', label: 'Very Happy', score: 5, color: 'cyber-primary', description: 'Positive neural patterns detected' },
    { emoji: '😊', label: 'Happy', score: 4, color: 'cyber-accent', description: 'Good neural activity' },
    { emoji: '😐', label: 'Neutral', score: 3, color: 'cyber-secondary', description: 'Baseline neural activity' },
    { emoji: '😔', label: 'Sad', score: 2, color: 'red-500', description: 'Low frequency patterns' },
    { emoji: '😢', label: 'Very Sad', score: 1, color: 'purple-500', description: 'High intensity signals' },
  ];

  const handleEmotionToggle = (emotion: string) => {
    console.log('🔍 MoodModal Emotion clicked:', emotion);
    setEmotions(prev => {
      const newEmotions = prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion];
      console.log('🔍 MoodModal New emotions array:', newEmotions);
      return newEmotions;
    });
  };

  const handleActivityToggle = (activity: string) => {
    console.log('🔍 MoodModal Activity clicked:', activity);
    setActivities(prev => {
      const newActivities = prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity];
      console.log('🔍 MoodModal New activities array:', newActivities);
      return newActivities;
    });
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🔍 MoodModal Debug - Before addMoodEntry:');
      console.log('Selected mood:', selectedMood);
      console.log('Notes:', notes);
      console.log('Intensity:', intensity);
      console.log('Emotions array:', emotions);
      console.log('Activities array:', activities);
      
      await addMoodEntry(
        moodOptions.find(m => m.score === selectedMood)?.label || 'Unknown',
        notes,
        intensity,
        emotions,
        activities
      );
      console.log('Save successful');
      
      setSelectedMood(null);
      setNotes('');
      setIntensity(5);
      setEmotions([]);
      setActivities([]);
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
      <div className="cyber-modal max-w-lg w-full max-h-[90vh] overflow-y-auto">
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

        {/* Emotions */}
        <div className="p-6 border-t border-cyber-border">
          <div className="flex items-center mb-3">
            <Smile className="w-5 h-5 text-cyber-primary mr-2" />
            <h3 className="cyber-label">Emotional Patterns (Optional)</h3>
            {emotions.length > 0 && (
              <span className="text-cyber-accent text-sm ml-2">
                ({emotions.length} selected)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => handleEmotionToggle(emotion)}
                className={`cyber-badge cursor-pointer transition-all ${
                  emotions.includes(emotion)
                    ? 'bg-cyber-primary bg-opacity-30 text-cyber-primary border-cyber-primary shadow-cyber-glow'
                    : 'bg-cyber-border bg-opacity-20 text-cyber-text-muted border-cyber-border hover:border-cyber-primary hover:bg-opacity-30'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
          {emotions.length > 0 && (
            <div className="mt-2 text-sm text-cyber-accent">
              Selected: {emotions.join(', ')}
            </div>
          )}
        </div>

        {/* Activities */}
        <div className="p-6 border-t border-cyber-border">
          <div className="flex items-center mb-3">
            <Activity className="w-5 h-5 text-cyber-accent mr-2" />
            <h3 className="cyber-label">Activity Patterns (Optional)</h3>
            {activities.length > 0 && (
              <span className="text-cyber-accent text-sm ml-2">
                ({activities.length} selected)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => handleActivityToggle(activity)}
                className={`cyber-badge cursor-pointer transition-all ${
                  activities.includes(activity)
                    ? 'bg-cyber-accent bg-opacity-30 text-cyber-accent border-cyber-accent shadow-cyber-glow'
                    : 'bg-cyber-border bg-opacity-20 text-cyber-text-muted border-cyber-border hover:border-cyber-accent hover:bg-opacity-30'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
          {activities.length > 0 && (
            <div className="mt-2 text-sm text-cyber-accent">
              Selected: {activities.join(', ')}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="p-6 border-t border-cyber-border">
          <div className="flex items-center mb-3">
            <BookOpen className="w-5 h-5 text-cyber-secondary mr-2" />
            <h3 className="cyber-label">Neural Notes (Optional)</h3>
          </div>
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