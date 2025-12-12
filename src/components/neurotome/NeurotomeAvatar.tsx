import React from 'react';
import { cn } from '@/lib/utils';

export type AvatarExpression = 'neutral' | 'listening' | 'speaking' | 'empathetic' | 'happy' | 'concerned';

interface NeurotomeAvatarProps {
  expression?: AvatarExpression;
  isListening?: boolean;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NeurotomeAvatar: React.FC<NeurotomeAvatarProps> = ({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  size = 'lg',
  className
}) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const getEyeAnimation = () => {
    if (isListening) return 'animate-pulse';
    return 'animate-blink';
  };

  const getMouthPath = () => {
    switch (expression) {
      case 'happy':
        return 'M 35 65 Q 50 80 65 65'; // Smile
      case 'empathetic':
        return 'M 35 68 Q 50 72 65 68'; // Gentle understanding
      case 'concerned':
        return 'M 35 70 Q 50 65 65 70'; // Slight frown
      case 'speaking':
        return 'M 40 65 Q 50 72 60 65'; // Open for speaking
      case 'listening':
        return 'M 38 67 Q 50 70 62 67'; // Attentive
      default:
        return 'M 38 67 Q 50 72 62 67'; // Neutral gentle smile
    }
  };

  const getEyebrowTransform = () => {
    switch (expression) {
      case 'empathetic':
        return 'rotate(-5deg)';
      case 'concerned':
        return 'rotate(5deg)';
      case 'happy':
        return 'rotate(-3deg) translateY(-2px)';
      default:
        return 'rotate(0deg)';
    }
  };

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {/* Outer glow ring */}
      <div 
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-br from-sage/30 to-calm/40',
          'animate-gentle-pulse',
          isListening && 'from-sky/40 to-accent/50',
          isSpeaking && 'from-gentle-glow/50 to-primary/40'
        )}
      />
      
      {/* Avatar container */}
      <div 
        className={cn(
          'relative w-[85%] h-[85%] rounded-full overflow-hidden',
          'bg-gradient-to-b from-avatar-skin to-avatar-blush/50',
          'shadow-lg border-4 border-card/50',
          'animate-breathe'
        )}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          aria-label="Neurotome Avatar"
        >
          {/* Face base gradient */}
          <defs>
            <radialGradient id="faceGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="hsl(var(--avatar-skin))" />
              <stop offset="100%" stopColor="hsl(var(--avatar-blush) / 0.3)" />
            </radialGradient>
            <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--avatar-iris))" />
              <stop offset="100%" stopColor="hsl(var(--avatar-eye))" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Blush circles */}
          <ellipse 
            cx="25" cy="55" rx="10" ry="6" 
            className="fill-avatar-blush/40"
          />
          <ellipse 
            cx="75" cy="55" rx="10" ry="6" 
            className="fill-avatar-blush/40"
          />
          
          {/* Left eyebrow */}
          <path 
            d="M 25 32 Q 35 28 42 32" 
            fill="none" 
            stroke="hsl(var(--moss))" 
            strokeWidth="2" 
            strokeLinecap="round"
            style={{ transform: getEyebrowTransform(), transformOrigin: '33px 30px' }}
          />
          
          {/* Right eyebrow */}
          <path 
            d="M 58 32 Q 65 28 75 32" 
            fill="none" 
            stroke="hsl(var(--moss))" 
            strokeWidth="2" 
            strokeLinecap="round"
            style={{ transform: getEyebrowTransform(), transformOrigin: '67px 30px' }}
          />
          
          {/* Left eye container */}
          <g className={getEyeAnimation()} style={{ transformOrigin: '35px 45px' }}>
            {/* Eye white */}
            <ellipse 
              cx="35" cy="45" rx="10" ry="8" 
              className="fill-card"
              filter="url(#softGlow)"
            />
            {/* Iris */}
            <ellipse 
              cx="35" cy="45" rx="6" ry="6" 
              fill="url(#eyeGradient)"
            />
            {/* Pupil */}
            <circle 
              cx="35" cy="45" r="3" 
              className="fill-foreground"
            />
            {/* Eye shine */}
            <circle 
              cx="37" cy="43" r="1.5" 
              className="fill-card"
            />
          </g>
          
          {/* Right eye container */}
          <g className={getEyeAnimation()} style={{ transformOrigin: '65px 45px' }}>
            {/* Eye white */}
            <ellipse 
              cx="65" cy="45" rx="10" ry="8" 
              className="fill-card"
              filter="url(#softGlow)"
            />
            {/* Iris */}
            <ellipse 
              cx="65" cy="45" rx="6" ry="6" 
              fill="url(#eyeGradient)"
            />
            {/* Pupil */}
            <circle 
              cx="65" cy="45" r="3" 
              className="fill-foreground"
            />
            {/* Eye shine */}
            <circle 
              cx="67" cy="43" r="1.5" 
              className="fill-card"
            />
          </g>
          
          {/* Nose hint */}
          <path 
            d="M 50 50 Q 48 55 50 58" 
            fill="none" 
            stroke="hsl(var(--avatar-blush))" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          
          {/* Mouth */}
          <path 
            d={getMouthPath()} 
            fill="none" 
            stroke="hsl(var(--moss))" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            className={cn(isSpeaking && 'animate-speak')}
            style={{ transformOrigin: '50px 67px' }}
          />
        </svg>
      </div>
      
      {/* Speaking/Listening indicator ring */}
      {(isListening || isSpeaking) && (
        <div 
          className={cn(
            'absolute inset-0 rounded-full border-4',
            'animate-pulse',
            isListening && 'border-sky/60',
            isSpeaking && 'border-primary/60'
          )}
        />
      )}
    </div>
  );
};

export default NeurotomeAvatar;
