import React from 'react';
import { Brain } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="cyber-dashboard flex items-center justify-center min-h-screen">
      <div className="cyber-card p-12 text-center max-w-md mx-auto">
        {/* Cyberpunk Loading Animation */}
        <div className="relative mb-8">
          <div className="cyber-spinner w-16 h-16 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-8 h-8 text-cyber-primary animate-cyber-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="cyber-text text-2xl font-bold">Initializing Neural Interface</h2>
          <p className="text-cyber-text-muted">
            Connecting to mood matrix...
          </p>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
            <div className="w-2 h-2 bg-cyber-accent rounded-full animate-cyber-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-cyber-secondary rounded-full animate-cyber-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Status Indicators */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cyber-text-muted">Neural Link</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-cyber-pulse"></div>
                <span className="text-cyber-primary font-mono">CONNECTING</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cyber-text-muted">Data Sync</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-cyber-accent rounded-full mr-2"></div>
                <span className="text-cyber-accent font-mono">PENDING</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cyber-text-muted">Memory Core</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-cyber-secondary rounded-full mr-2"></div>
                <span className="text-cyber-secondary font-mono">INITIALIZING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;