import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/hooks/useNeurotomeChat';

interface ConversationViewProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  isLoading,
  className
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div 
      ref={scrollRef}
      className={cn(
        'flex-1 overflow-y-auto p-4 space-y-4',
        'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
        className
      )}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'max-w-[80%] p-4 rounded-2xl',
              'animate-fade-in',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-card text-card-foreground rounded-bl-md shadow-sm border border-border'
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <span className={cn(
              'text-xs mt-2 block',
              message.role === 'user' 
                ? 'text-primary-foreground/70' 
                : 'text-muted-foreground'
            )}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-muted-foreground">Neurotome is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationView;
