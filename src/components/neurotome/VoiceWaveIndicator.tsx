import React from 'react';
import { cn } from '@/lib/utils';

interface VoiceWaveIndicatorProps {
  isActive: boolean;
  type: 'listening' | 'speaking';
  className?: string;
}

const VoiceWaveIndicator: React.FC<VoiceWaveIndicatorProps> = ({
  isActive,
  type,
  className
}) => {
  const bars = [1, 2, 3, 4, 5];
  
  return (
    <div 
      className={cn(
        'flex items-center justify-center gap-1 h-8',
        className
      )}
    >
      {bars.map((bar) => (
        <div
          key={bar}
          className={cn(
            'w-1 rounded-full transition-all duration-300',
            isActive ? 'animate-wave' : 'h-2',
            type === 'listening' ? 'bg-sky' : 'bg-primary',
            !isActive && 'bg-muted'
          )}
          style={{
            animationDelay: isActive ? `${bar * 0.1}s` : '0s',
            height: isActive ? undefined : '8px'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveIndicator;
