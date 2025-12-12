import React from 'react';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import VoiceWaveIndicator from './VoiceWaveIndicator';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  isDisabled?: boolean;
  onPress: () => void;
  onStopSpeaking?: () => void;
  className?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isSpeaking,
  isDisabled,
  onPress,
  onStopSpeaking,
  className
}) => {
  const handleClick = () => {
    if (isSpeaking && onStopSpeaking) {
      onStopSpeaking();
    } else {
      onPress();
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          'relative w-20 h-20 rounded-full',
          'flex items-center justify-center',
          'transition-all duration-300',
          'focus:outline-none focus:ring-4 focus:ring-ring/50',
          isListening && 'bg-sky scale-110 shadow-lg shadow-sky/30',
          isSpeaking && 'bg-primary scale-105 shadow-lg shadow-primary/30',
          !isListening && !isSpeaking && 'bg-muted hover:bg-accent hover:scale-105',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label={
          isSpeaking ? 'Stop speaking' : 
          isListening ? 'Stop listening' : 
          'Start speaking'
        }
      >
        {/* Pulse ring when active */}
        {(isListening || isSpeaking) && (
          <div 
            className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-30',
              isListening && 'bg-sky',
              isSpeaking && 'bg-primary'
            )}
          />
        )}
        
        {/* Icon */}
        {isSpeaking ? (
          <Volume2 className="w-8 h-8 text-primary-foreground animate-pulse" />
        ) : isListening ? (
          <Mic className="w-8 h-8 text-foreground" />
        ) : (
          <Mic className="w-8 h-8 text-muted-foreground" />
        )}
      </button>
      
      {/* Voice indicator */}
      <VoiceWaveIndicator 
        isActive={isListening || isSpeaking}
        type={isSpeaking ? 'speaking' : 'listening'}
      />
      
      {/* Status text */}
      <span className="text-sm text-muted-foreground">
        {isSpeaking ? 'Speaking...' : 
         isListening ? 'Listening...' : 
         'Tap to speak'}
      </span>
    </div>
  );
};

export default VoiceButton;
