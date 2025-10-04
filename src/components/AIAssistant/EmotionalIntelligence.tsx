import type { MoodEntry } from '../../contexts/MoodContext';

export interface EmotionalState {
  currentMood: number;
  trend: 'improving' | 'declining' | 'stable';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  copingStrategies: string[];
  lastCrisisCheck: Date;
}

export interface ConversationMemory {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  emotionalContext: EmotionalState;
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'concerning';
}

export interface CopingStrategy {
  id: string;
  name: string;
  description: string;
  category: 'immediate' | 'preventive' | 'long-term';
  effectiveness: number; // 0-1 scale
  lastUsed: Date | null;
  successRate: number;
}

export class EmotionalIntelligenceEngine {
  private conversationHistory: ConversationMemory[] = [];
  private copingStrategies: CopingStrategy[] = [];
  // private userPreferences: any = {};

  constructor() {
    this.initializeCopingStrategies();
  }

  private initializeCopingStrategies() {
    this.copingStrategies = [
      {
        id: 'breathing',
        name: 'Deep Breathing',
        description: '4-7-8 breathing technique for immediate calm',
        category: 'immediate',
        effectiveness: 0.8,
        lastUsed: null,
        successRate: 0.75
      },
      {
        id: 'grounding',
        name: '5-4-3-2-1 Grounding',
        description: 'Sensory grounding technique for anxiety',
        category: 'immediate',
        effectiveness: 0.7,
        lastUsed: null,
        successRate: 0.68
      },
      {
        id: 'journaling',
        name: 'Emotional Journaling',
        description: 'Write about feelings and thoughts',
        category: 'preventive',
        effectiveness: 0.6,
        lastUsed: null,
        successRate: 0.72
      },
      {
        id: 'movement',
        name: 'Gentle Movement',
        description: 'Light exercise or stretching',
        category: 'immediate',
        effectiveness: 0.65,
        lastUsed: null,
        successRate: 0.70
      },
      {
        id: 'social',
        name: 'Social Connection',
        description: 'Reach out to trusted person',
        category: 'preventive',
        effectiveness: 0.75,
        lastUsed: null,
        successRate: 0.78
      },
      {
        id: 'mindfulness',
        name: 'Mindfulness Practice',
        description: 'Present moment awareness',
        category: 'long-term',
        effectiveness: 0.7,
        lastUsed: null,
        successRate: 0.65
      }
    ];
  }

  analyzeEmotionalState(moodEntries: MoodEntry[]): EmotionalState {
    if (moodEntries.length === 0) {
      return {
        currentMood: 3,
        trend: 'stable',
        riskLevel: 'low',
        triggers: [],
        copingStrategies: [],
        lastCrisisCheck: new Date()
      };
    }

    const recentEntries = moodEntries.slice(0, 7);
    const currentMood = recentEntries[0]?.mood_score || 3;
    const avgMood = recentEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / recentEntries.length;
    
    // Calculate trend
    const olderEntries = moodEntries.slice(7, 14);
    const olderAvg = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / olderEntries.length
      : avgMood;
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (avgMood > olderAvg + 0.5) trend = 'improving';
    else if (avgMood < olderAvg - 0.5) trend = 'declining';

    // Assess risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (currentMood <= 1 || (avgMood <= 2 && trend === 'declining')) {
      riskLevel = 'critical';
    } else if (currentMood <= 2 || (avgMood <= 2.5 && trend === 'declining')) {
      riskLevel = 'high';
    } else if (currentMood <= 3 || avgMood <= 3) {
      riskLevel = 'medium';
    }

    // Extract triggers from journal entries
    const triggers = this.extractTriggers(moodEntries);
    
    // Recommend coping strategies
    const copingStrategies = this.recommendCopingStrategies(currentMood, riskLevel, triggers);

    return {
      currentMood,
      trend,
      riskLevel,
      triggers,
      copingStrategies,
      lastCrisisCheck: new Date()
    };
  }

  private extractTriggers(moodEntries: MoodEntry[]): string[] {
    const triggerKeywords = {
      'work': ['work', 'job', 'boss', 'deadline', 'meeting', 'project'],
      'relationships': ['friend', 'family', 'partner', 'relationship', 'argument', 'conflict'],
      'health': ['sick', 'pain', 'tired', 'sleep', 'exercise', 'diet'],
      'financial': ['money', 'bills', 'debt', 'financial', 'expensive', 'cost'],
      'social': ['lonely', 'isolated', 'social', 'party', 'event', 'crowd'],
      'environment': ['weather', 'noise', 'crowded', 'chaos', 'messy', 'cluttered']
    };

    const triggers: string[] = [];
    const recentEntries = moodEntries.slice(0, 10);

    recentEntries.forEach(entry => {
      if (entry.journal_entry) {
        const text = entry.journal_entry.toLowerCase();
        Object.entries(triggerKeywords).forEach(([category, keywords]) => {
          if (keywords.some(keyword => text.includes(keyword))) {
            if (!triggers.includes(category)) {
              triggers.push(category);
            }
          }
        });
      }
    });

    return triggers;
  }

  private recommendCopingStrategies(currentMood: number, riskLevel: string, triggers: string[]): string[] {
    let strategies: string[] = [];

    // Immediate strategies for low mood
    if (currentMood <= 2) {
      strategies.push('breathing', 'grounding', 'movement');
    }

    // Preventive strategies for medium risk
    if (riskLevel === 'medium' || riskLevel === 'high') {
      strategies.push('journaling', 'social');
    }

    // Long-term strategies for ongoing issues
    if (triggers.length > 2) {
      strategies.push('mindfulness');
    }

    // Remove duplicates and return
    return [...new Set(strategies)];
  }

  detectCrisis(userMessage: string, emotionalState: EmotionalState): boolean {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living',
      'hurt myself', 'self harm', 'cut myself', 'overdose',
      'want to die', 'better off dead', 'no point', 'hopeless'
    ];

    const message = userMessage.toLowerCase();
    const hasCrisisKeywords = crisisKeywords.some(keyword => message.includes(keyword));
    
    const isHighRisk = emotionalState.riskLevel === 'critical' || 
                      (emotionalState.currentMood <= 1 && emotionalState.trend === 'declining');

    return hasCrisisKeywords || isHighRisk;
  }

  generateContextualResponse(
    userMessage: string, 
    emotionalState: EmotionalState, 
    moodEntries: MoodEntry[]
  ): string {
    const lowerMessage = userMessage.toLowerCase();
    const isCrisis = this.detectCrisis(userMessage, emotionalState);

    // Crisis response
    if (isCrisis) {
      return this.generateCrisisResponse();
    }

    // Emotional support responses
    if (emotionalState.riskLevel === 'high' || emotionalState.riskLevel === 'critical') {
      return this.generateSupportiveResponse(emotionalState, lowerMessage);
    }

    // Pattern analysis
    if (lowerMessage.includes('analyze') || lowerMessage.includes('pattern')) {
      return this.generatePatternAnalysis(moodEntries, emotionalState);
    }

    // Coping strategy requests
    if (lowerMessage.includes('help') || lowerMessage.includes('coping') || lowerMessage.includes('strategy')) {
      return this.generateCopingRecommendations(emotionalState);
    }

    // General emotional check-in
    if (lowerMessage.includes('how') && (lowerMessage.includes('feel') || lowerMessage.includes('mood'))) {
      return this.generateEmotionalCheckIn(emotionalState);
    }

    // Default empathetic response
    return this.generateEmpatheticResponse(emotionalState, lowerMessage);
  }

  private generateCrisisResponse(): string {
    return `🚨 CRISIS DETECTION ACTIVATED

I'm deeply concerned about what you're experiencing right now. Your safety is the most important thing.

IMMEDIATE SUPPORT:
• National Suicide Prevention Lifeline: 988 (US) or 1-800-273-8255
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911

You are not alone. These feelings, while overwhelming, are temporary. Please reach out to a trusted person or professional immediately.

I'm here to listen, but please also connect with human support right now. Your life has value and meaning.`;
  }

  private generateSupportiveResponse(emotionalState: EmotionalState, _message: string): string {
    const strategies = this.copingStrategies.filter(s => 
      emotionalState.copingStrategies.includes(s.id)
    );

    return `💙 EMOTIONAL SUPPORT ACTIVATED

I can see you're going through a difficult time right now. Your feelings are valid, and it's okay to not be okay.

CURRENT ASSESSMENT:
• Mood Level: ${emotionalState.currentMood}/5
• Trend: ${emotionalState.trend}
• Risk Level: ${emotionalState.riskLevel.toUpperCase()}

IMMEDIATE COPING STRATEGIES:
${strategies.map(s => `• ${s.name}: ${s.description}`).join('\n')}

Remember: This feeling will pass. You've gotten through difficult times before, and you can get through this too.

Would you like me to guide you through one of these strategies, or would you prefer to talk about what's on your mind?`;
  }

  private generatePatternAnalysis(moodEntries: MoodEntry[], emotionalState: EmotionalState): string {
    const totalEntries = moodEntries.length;
    const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / totalEntries;
    const recentAvg = moodEntries.slice(0, 7).reduce((sum, entry) => sum + entry.mood_score, 0) / 7;

    return `🧠 EMOTIONAL PATTERN ANALYSIS

DATA OVERVIEW:
• Total Entries: ${totalEntries}
• Overall Average: ${avgMood.toFixed(1)}/5
• Recent Average: ${recentAvg.toFixed(1)}/5
• Current Trend: ${emotionalState.trend.toUpperCase()}

PATTERN INSIGHTS:
${emotionalState.trend === 'improving' ? '• Positive momentum detected - keep up current practices' : 
  emotionalState.trend === 'declining' ? '• Declining trend - consider additional support strategies' : 
  '• Stable patterns - good foundation for growth'}

IDENTIFIED TRIGGERS:
${emotionalState.triggers.length > 0 ? 
  emotionalState.triggers.map(t => `• ${t.charAt(0).toUpperCase() + t.slice(1)}`).join('\n') : 
  '• No clear triggers identified yet'}

RECOMMENDATIONS:
• Continue tracking for deeper insights
• Focus on ${emotionalState.copingStrategies.length > 0 ? 'proven coping strategies' : 'building coping toolkit'}
• Consider professional support if patterns persist

Your emotional data shows resilience and self-awareness. Keep going.`;
  }

  private generateCopingRecommendations(emotionalState: EmotionalState): string {
    const strategies = this.copingStrategies.filter(s => 
      emotionalState.copingStrategies.includes(s.id)
    );

    return `🛠️ PERSONALIZED COPING STRATEGIES

Based on your current emotional state, here are strategies that may help:

IMMEDIATE RELIEF:
${strategies.filter(s => s.category === 'immediate').map(s => 
  `• ${s.name}: ${s.description} (${Math.round(s.effectiveness * 100)}% effective)`
).join('\n')}

PREVENTIVE MEASURES:
${strategies.filter(s => s.category === 'preventive').map(s => 
  `• ${s.name}: ${s.description} (${Math.round(s.effectiveness * 100)}% effective)`
).join('\n')}

LONG-TERM BUILDING:
${strategies.filter(s => s.category === 'long-term').map(s => 
  `• ${s.name}: ${s.description} (${Math.round(s.effectiveness * 100)}% effective)`
).join('\n')}

Remember: Different strategies work for different people. Start with what feels manageable and build from there.

Would you like me to guide you through any of these strategies?`;
  }

  private generateEmotionalCheckIn(emotionalState: EmotionalState): string {
    return `💭 EMOTIONAL CHECK-IN

I can see from your recent entries that you're at a ${emotionalState.currentMood}/5 mood level, with a ${emotionalState.trend} trend.

How are you feeling right now, in this moment? Sometimes our mood can shift throughout the day.

I'm here to listen without judgment. Whether you're feeling overwhelmed, sad, anxious, or anything else - your feelings are valid and important.

What's on your mind today?`;
  }

  private generateEmpatheticResponse(_emotionalState: EmotionalState, _message: string): string {
    const responses = [
      `I hear you, and I want you to know that what you're feeling matters. Your emotional journey is unique, and I'm here to support you through it.`,
      `Thank you for sharing that with me. It takes courage to open up about your feelings. I'm listening and I care about what you're experiencing.`,
      `I can sense the weight of what you're carrying right now. You don't have to face this alone - I'm here to walk alongside you.`,
      `Your feelings are completely valid. Sometimes just expressing what we're going through can be the first step toward feeling better.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  addConversationMemory(
    userMessage: string, 
    aiResponse: string, 
    emotionalState: EmotionalState
  ): void {
    const memory: ConversationMemory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userMessage,
      aiResponse,
      emotionalContext: emotionalState,
      topics: this.extractTopics(userMessage),
      sentiment: this.analyzeSentiment(userMessage)
    };

    this.conversationHistory.push(memory);
    
    // Keep only last 50 conversations
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  private extractTopics(message: string): string[] {
    const topics: string[] = [];
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('work') || lowerMessage.includes('job')) topics.push('work');
    if (lowerMessage.includes('family') || lowerMessage.includes('relationship')) topics.push('relationships');
    if (lowerMessage.includes('health') || lowerMessage.includes('sick')) topics.push('health');
    if (lowerMessage.includes('money') || lowerMessage.includes('financial')) topics.push('finance');
    if (lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) topics.push('anxiety');
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) topics.push('depression');

    return topics;
  }

  private analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' | 'concerning' {
    const lowerMessage = message.toLowerCase();
    
    const positiveWords = ['good', 'great', 'happy', 'excited', 'grateful', 'hopeful', 'better'];
    const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'angry', 'frustrated', 'hopeless'];
    const concerningWords = ['suicide', 'hurt', 'end', 'worthless', 'burden', 'alone'];

    if (concerningWords.some(word => lowerMessage.includes(word))) {
      return 'concerning';
    }

    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  getConversationHistory(): ConversationMemory[] {
    return this.conversationHistory;
  }

  getCopingStrategies(): CopingStrategy[] {
    return this.copingStrategies;
  }
}
