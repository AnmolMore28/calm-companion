import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingExerciseProps {
  className?: string;
  onComplete?: () => void;
}

const BREATH_PATTERN = {
  inhale: 4,
  hold: 4,
  exhale: 6,
  rest: 2
};

const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  rest: 'Rest'
};

const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  className,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(BREATH_PATTERN.inhale);
  const [cycles, setCycles] = useState(0);

  const getNextPhase = (current: BreathPhase): BreathPhase => {
    const sequence: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
    const currentIndex = sequence.indexOf(current);
    return sequence[(currentIndex + 1) % sequence.length];
  };

  const resetExercise = useCallback(() => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(BREATH_PATTERN.inhale);
    setCycles(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(phase);
          setPhase(nextPhase);
          
          if (nextPhase === 'inhale') {
            setCycles((c) => {
              const newCycles = c + 1;
              if (newCycles >= 4) {
                setIsActive(false);
                onComplete?.();
              }
              return newCycles;
            });
          }
          
          return BREATH_PATTERN[nextPhase];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, onComplete]);

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-90';
      case 'rest':
        return 'scale-100';
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      <h3 className="text-lg font-medium text-foreground">
        4-4-6 Breathing Exercise
      </h3>
      
      {/* Breathing circle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer ring */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-br from-sage/40 to-calm/50',
            'transition-transform duration-1000 ease-in-out',
            isActive && getCircleScale()
          )}
        />
        
        {/* Inner circle */}
        <div 
          className={cn(
            'relative w-36 h-36 rounded-full',
            'bg-gradient-to-br from-primary/30 to-accent/40',
            'flex flex-col items-center justify-center',
            'transition-transform duration-1000 ease-in-out',
            isActive && getCircleScale()
          )}
        >
          <span className="text-3xl font-bold text-foreground">
            {countdown}
          </span>
          <span className="text-sm font-medium text-muted-foreground mt-1">
            {phaseLabels[phase]}
          </span>
        </div>
      </div>
      
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              i < cycles ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
      
      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant={isActive ? 'secondary' : 'default'}
          size="lg"
          onClick={() => setIsActive(!isActive)}
          className="gap-2"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {cycles > 0 ? 'Resume' : 'Start'}
            </>
          )}
        </Button>
        
        {cycles > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={resetExercise}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        This breathing technique activates your parasympathetic nervous system to help you relax.
      </p>
    </div>
  );
};

export default BreathingExercise;
