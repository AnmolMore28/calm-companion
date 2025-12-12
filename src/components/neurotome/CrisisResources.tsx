import React from 'react';
import { cn } from '@/lib/utils';
import { Phone, MessageCircle, Globe, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CrisisResourcesProps {
  className?: string;
  compact?: boolean;
}

const resources = [
  {
    name: 'Suicide & Crisis Lifeline',
    contact: '988',
    type: 'phone',
    description: '24/7 free and confidential support',
    icon: Phone
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    type: 'text',
    description: 'Free 24/7 crisis support via text',
    icon: MessageCircle
  },
  {
    name: 'SAMHSA Helpline',
    contact: '1-800-662-4357',
    type: 'phone',
    description: 'Mental health treatment referral service',
    icon: Phone
  },
  {
    name: 'International Resources',
    contact: 'findahelpline.com',
    type: 'web',
    description: 'Find crisis lines in your country',
    icon: Globe
  }
];

const CrisisResources: React.FC<CrisisResourcesProps> = ({
  className,
  compact = false
}) => {
  if (compact) {
    return (
      <div className={cn('p-4 rounded-lg bg-warmth/20 border border-warmth/30', className)}>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-warmth" />
          <span className="font-medium text-sm">Need immediate help?</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Call <strong>988</strong> or text <strong>HOME to 741741</strong>
        </p>
      </div>
    );
  }

  return (
    <Card className={cn('bg-card', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="w-5 h-5 text-destructive" />
          Crisis Resources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          You're not alone. Help is available 24/7.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map((resource) => (
          <div 
            key={resource.name}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="p-2 rounded-full bg-primary/10">
              <resource.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{resource.name}</h4>
              <p className="text-primary font-semibold">{resource.contact}</p>
              <p className="text-xs text-muted-foreground">{resource.description}</p>
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            If you're in immediate danger, please call emergency services (911 in the US).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrisisResources;
