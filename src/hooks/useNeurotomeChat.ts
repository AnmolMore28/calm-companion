import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mood?: string;
}

interface UseNeurotomeChatProps {
  apiEndpoint?: string;
}

interface UseNeurotomeChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<string>;
  clearMessages: () => void;
}

const SYSTEM_CONTEXT = `You are Neurotome, a compassionate AI mental health companion. Your role is to:
- Provide emotional support and active listening
- Guide users through relaxation and breathing exercises
- Help with mood tracking and emotional awareness
- Offer therapeutic conversation techniques (CBT-inspired, mindfulness)
- Recognize signs of crisis and provide appropriate resources
- Always maintain a calm, warm, and non-judgmental tone

Important guidelines:
- Keep responses concise but caring (2-4 sentences typically)
- Use gentle, encouraging language
- If someone expresses crisis or self-harm thoughts, acknowledge their pain and provide crisis resources
- Suggest grounding techniques when someone seems anxious
- Never diagnose or replace professional help

Crisis resources to share when needed:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/`;

export const useNeurotomeChat = ({
  apiEndpoint = 'http://localhost:8000/api/llm'
}: UseNeurotomeChatProps = {}): UseNeurotomeChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string): Promise<string> => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Build conversation context
      const conversationHistory = messages
        .slice(-10) // Last 10 messages for context
        .map(m => `${m.role === 'user' ? 'User' : 'Neurotome'}: ${m.content}`)
        .join('\n');
      
      const prompt = `${SYSTEM_CONTEXT}\n\nConversation history:\n${conversationHistory}\n\nUser: ${text}\n\nNeurotome:`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.response || "I'm here for you. How can I help?";
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      return aiResponse;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection error';
      setError(errorMessage);
      
      // Provide a fallback response
      const fallbackResponse = "I'm having trouble connecting right now, but I'm still here with you. Take a deep breath, and let's try again in a moment.";
      
      const fallbackMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      return fallbackResponse;
      
    } finally {
      setIsLoading(false);
    }
  }, [messages, apiEndpoint]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
