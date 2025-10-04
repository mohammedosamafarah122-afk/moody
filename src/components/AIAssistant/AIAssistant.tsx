import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Brain } from 'lucide-react';
import { useMood } from '../../contexts/MoodContext';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { moodEntries, stats } = useMood();
  
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🌐 EMOTIONAL INTELLIGENCE SYSTEM ONLINE\n\nHello, I'm your AI mental health companion. I'm here to provide empathetic support, analyze your emotional patterns, and help you navigate your mental health journey.\n\nI can:\n• Analyze your mood patterns and trends\n• Provide personalized coping strategies\n• Detect concerning patterns and offer support\n• Remember our conversations for better help\n• Offer crisis resources when needed\n\nHow are you feeling today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Analyze command
    if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
      if (moodEntries.length === 0) {
        return "🔍 ANALYSIS INITIATED\n\nNeural database empty. No mood patterns detected.\n\nRecommendation: Start logging your neural patterns to enable analysis.\n\nType 'help' for available commands.";
      }
      
      const totalEntries = stats.totalEntries;
      const currentStreak = stats.currentStreak;
      const weeklyAverage = stats.weeklyAverage;
      const avgIntensity = stats.averageIntensity;
      
      return `🧠 NEURAL PATTERN ANALYSIS COMPLETE\n\n📊 Database Status:\n• Total Entries: ${totalEntries}\n• Weekly Average: ${weeklyAverage}/5\n• Current Streak: ${currentStreak} days\n• Average Intensity: ${avgIntensity}/10\n\n🔮 Pattern Insights:\n${weeklyAverage >= 4 ? '• Excellent neural stability detected' : weeklyAverage >= 3 ? '• Stable emotional patterns observed' : '• Emotional volatility detected - recommend monitoring'}\n\nType 'trends' for detailed trend analysis.`;
    }
    
    // Trends command
    if (lowerMessage.includes('trend') || lowerMessage.includes('pattern')) {
      if (moodEntries.length < 3) {
        return "📈 TREND ANALYSIS\n\nInsufficient data for trend analysis. Minimum 3 entries required.\n\nContinue logging to unlock trend insights.";
      }
      
      const weeklyAverage = stats.weeklyAverage;
      const avgIntensity = stats.averageIntensity;
      const mostCommonMood = stats.mostCommonMood;
      
      return `📈 NEURAL TREND ANALYSIS\n\n🔮 Recent Patterns:\n• Weekly average: ${weeklyAverage}/5\n• Intensity level: ${avgIntensity}/10\n• Most common mood: ${mostCommonMood}\n\n💡 Recommendations:\n${weeklyAverage >= 4 ? '• Maintain current emotional practices' : '• Consider mood enhancement strategies'}\n\nType 'insights' for personalized recommendations.`;
    }
    
    // Insights command
    if (lowerMessage.includes('insight') || lowerMessage.includes('recommend')) {
      const insights = [];
      
      if (stats.weeklyAverage < 3) {
        insights.push('• Consider stress reduction techniques');
        insights.push('• Monitor sleep and exercise patterns');
      }
      
      if (stats.currentStreak > 7) {
        insights.push('• Excellent consistency! Keep tracking');
      } else if (stats.currentStreak < 3) {
        insights.push('• Build tracking habits for better insights');
      }
      
      if (moodEntries.length > 10) {
        insights.push('• Rich data set - patterns becoming clear');
      }
      
      return `💡 PERSONALIZED NEURAL INSIGHTS\n\n🎯 Recommendations:\n${insights.join('\n') || '• Continue tracking for more insights'}\n\n🔬 Advanced Analysis:\n• Mood frequency: ${JSON.stringify(stats.moodFrequency)}\n• Most common mood: ${stats.mostCommonMood}\n• Pattern complexity: ${moodEntries.length > 20 ? 'High' : 'Developing'}\n\nType 'analyze' for fresh pattern analysis.`;
    }
    
    // Help command
    if (lowerMessage.includes('help') || lowerMessage.includes('command')) {
      return `🤖 AI ASSISTANT COMMAND MATRIX\n\n📋 Available Commands:\n• 'analyze' - Complete mood pattern analysis\n• 'trends' - View mood trend data\n• 'insights' - Get personalized recommendations\n• 'stats' - Display current statistics\n• 'help' - Show this command list\n\n💬 Natural Language:\nYou can also ask questions like:\n• "How am I feeling lately?"\n• "What patterns do you see?"\n• "Give me some insights"\n\n🌐 Neural status: ${moodEntries.length} entries logged`;
    }
    
    // Stats command
    if (lowerMessage.includes('stat') || lowerMessage.includes('data')) {
      return `📊 NEURAL DATABASE STATISTICS\n\n🔢 Current Metrics:\n• Total Entries: ${stats.totalEntries}\n• Weekly Average: ${stats.weeklyAverage}/5\n• Current Streak: ${stats.currentStreak} days\n• Average Intensity: ${stats.averageIntensity}/10\n• Most Common Mood: ${stats.mostCommonMood}\n\n📈 Mood Frequency:\n${Object.entries(stats.moodFrequency).map(([mood, count]) => `• ${mood}: ${count} entries`).join('\n')}`;
    }
    
    // General responses
    const responses = [
      `🌐 NEURAL PROCESSING\n\nI'm analyzing your query: "${userMessage}"\n\nBased on your ${moodEntries.length} mood entries, I can provide insights about your emotional patterns. Try asking:\n• "analyze my mood patterns"\n• "show me trends"\n• "give me insights"`,
      `🔮 PATTERN RECOGNITION\n\nQuery received: "${userMessage}"\n\nYour neural data shows ${stats.totalEntries} logged entries. For detailed analysis, use specific commands like 'analyze' or 'trends'.`,
      `⚡ NEURAL INTERFACE ACTIVE\n\nMessage processed: "${userMessage}"\n\nI'm your mood pattern analyst. Ask me to analyze your ${moodEntries.length} mood entries or request insights about your emotional journey.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Generate intelligent response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const botResponse = {
        id: messages.length + 2,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 cyber-btn-primary p-4 rounded-full shadow-cyber-glow hover:scale-110 transition-all duration-300 z-40 group"
        title="Open AI Assistant"
      >
        <Brain className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-end justify-center p-4 z-50">
          <div className="cyber-modal w-full max-w-lg h-[700px] flex flex-col animate-cyber-slide-up">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-cyber-border bg-gradient-to-r from-cyber-primary/10 to-cyber-accent/10">
              <div className="flex items-center">
                <div className="relative">
                  <Brain className="w-8 h-8 text-cyber-primary mr-4 animate-cyber-float" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                </div>
                <div>
                  <h3 className="cyber-text font-bold text-lg">NEURAL ANALYST</h3>
                  <p className="text-cyber-text-muted text-sm font-mono">Pattern Recognition System</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-cyber-surface rounded-lg transition-all border border-cyber-border hover:border-cyber-primary group"
              >
                <X size={20} className="text-cyber-text-muted group-hover:text-cyber-primary" />
              </button>
            </div>

             {/* Status Bar */}
             <div className="px-6 py-2 bg-cyber-surface border-b border-cyber-border">
               <div className="flex items-center justify-between text-xs font-mono">
                 <span className="text-cyber-text-muted">NEURAL STATUS:</span>
                 <div className="flex items-center space-x-4">
                   <span className="text-cyber-primary">● ONLINE</span>
                   <span className="text-cyber-text-muted">ENTRIES: {moodEntries.length}</span>
                   <span className="text-cyber-accent">● ACTIVE</span>
                 </div>
               </div>
             </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-cyber-bg to-cyber-surface/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-cyber-fade-in`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-xl ${
                      msg.isBot
                        ? 'cyber-card border border-cyber-border'
                        : 'bg-gradient-to-r from-cyber-primary to-cyber-accent text-cyber-bg'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {msg.isBot && (
                        <div className="flex-shrink-0 w-6 h-6 bg-cyber-primary rounded-full flex items-center justify-center">
                          <Brain className="w-3 h-3 text-cyber-bg" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line font-mono leading-relaxed">
                          {msg.text}
                        </p>
                        <p className={`text-xs mt-2 ${
                          msg.isBot ? 'text-cyber-text-muted' : 'text-cyber-bg/70'
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-cyber-fade-in">
                  <div className="cyber-card border border-cyber-border p-4 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyber-primary rounded-full flex items-center justify-center">
                        <Brain className="w-3 h-3 text-cyber-bg" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                        <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-cyber-text-muted text-sm font-mono">Processing neural data...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-cyber-border bg-cyber-surface">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter neural query..."
                  className="cyber-input flex-1 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="cyber-btn-primary p-3 disabled:opacity-50 group"
                  title="Send Message"
                >
                  <Send size={18} className="group-hover:animate-pulse" />
                </button>
              </div>
              
               {/* Quick Commands */}
               <div className="mt-3 flex flex-wrap gap-2">
                 {['analyze', 'trends', 'insights', 'help'].map((cmd) => (
                   <button
                     key={cmd}
                     onClick={() => setMessage(cmd)}
                     className="px-3 py-1 text-xs bg-cyber-border hover:bg-cyber-primary text-cyber-text hover:text-cyber-bg rounded-lg transition-all font-mono"
                   >
                     {cmd}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};