import React from 'react';
import { cn } from '@/lib/utils';

export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'struggling';

interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { level: 'great', emoji: '😊', label: 'Great', color: 'bg-mood-great' },
  { level: 'good', emoji: '🙂', label: 'Good', color: 'bg-mood-good' },
  { level: 'okay', emoji: '😐', label: 'Okay', color: 'bg-mood-okay' },
  { level: 'low', emoji: '😔', label: 'Low', color: 'bg-mood-low' },
  { level: 'struggling', emoji: '😢', label: 'Struggling', color: 'bg-mood-struggling' }
];

interface MoodSelectorProps {
  selectedMood?: MoodLevel;
  onMoodSelect: (mood: MoodLevel) => void;
  className?: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  className
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <h3 className="text-lg font-medium text-foreground">
        How are you feeling today?
      </h3>
      <div className="flex gap-3 flex-wrap justify-center">
        {moodOptions.map((mood) => (
          <button
            key={mood.level}
            onClick={() => onMoodSelect(mood.level)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl',
              'transition-all duration-300 hover:scale-110',
              'border-2 border-transparent',
              selectedMood === mood.level 
                ? `${mood.color} border-foreground/20 shadow-lg` 
                : 'bg-card hover:bg-accent/20'
            )}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className={cn(
              'text-sm font-medium',
              selectedMood === mood.level ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
