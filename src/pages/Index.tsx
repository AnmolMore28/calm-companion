import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/neurotome/Header';
import NeurotomeAvatar, { AvatarExpression } from '@/components/neurotome/NeurotomeAvatar';
import VoiceButton from '@/components/neurotome/VoiceButton';
import ConversationView from '@/components/neurotome/ConversationView';
import MoodSelector, { MoodLevel } from '@/components/neurotome/MoodSelector';
import BreathingExercise from '@/components/neurotome/BreathingExercise';
import CrisisResources from '@/components/neurotome/CrisisResources';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { useNeurotomeChat } from '@/hooks/useNeurotomeChat';
import { Button } from '@/components/ui/button';
import { Wind, X } from 'lucide-react';

type ViewState = 'welcome' | 'mood-check' | 'conversation' | 'breathing';

const Index: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('welcome');
  const [currentMood, setCurrentMood] = useState<MoodLevel | undefined>();
  const [avatarExpression, setAvatarExpression] = useState<AvatarExpression>('neutral');
  const [showBreathing, setShowBreathing] = useState(false);

  const { messages, isLoading, sendMessage } = useNeurotomeChat();

  const handleTranscript = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setAvatarExpression('empathetic');
    const response = await sendMessage(text);
    
    // Speak the response
    speak(response);
  }, [sendMessage]);

  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported
  } = useVoiceInteraction({
    onTranscript: handleTranscript,
    onSpeechEnd: () => setAvatarExpression('neutral')
  });

  // Update avatar expression based on state
  useEffect(() => {
    if (isListening) {
      setAvatarExpression('listening');
    } else if (isSpeaking) {
      setAvatarExpression('speaking');
    } else if (isLoading) {
      setAvatarExpression('empathetic');
    }
  }, [isListening, isSpeaking, isLoading]);

  const handleMoodSelect = useCallback((mood: MoodLevel) => {
    setCurrentMood(mood);
    setViewState('conversation');
    
    // Generate greeting based on mood
    const greetings: Record<MoodLevel, string> = {
      great: "That's wonderful to hear! I'm so glad you're feeling good. What's been making your day special?",
      good: "It's nice to hear you're doing well. I'm here if you'd like to chat about anything.",
      okay: "I hear you. Some days are just okay, and that's perfectly fine. Would you like to talk about what's on your mind?",
      low: "Thank you for sharing that with me. It takes courage to acknowledge when we're feeling low. I'm here to listen.",
      struggling: "I'm really glad you reached out. It sounds like you're going through a difficult time. I'm here for you, and you're not alone."
    };
    
    const greeting = greetings[mood];
    speak(greeting);
    
    // Add the greeting as a message
    sendMessage(`I'm feeling ${mood}`);
  }, [speak, sendMessage]);

  const handleVoicePress = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      if (viewState === 'welcome') {
        setViewState('mood-check');
      }
      startListening();
    }
  }, [isListening, startListening, stopListening, viewState]);

  const handleStartConversation = useCallback(() => {
    setViewState('mood-check');
    speak("Hello, I'm Neurotome, your mental wellness companion. Let's start by checking in. How are you feeling today?");
  }, [speak]);

  return (
    <div className="flex flex-col h-screen bg-nature-gradient">
      <Header />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center py-6 px-4">
          <NeurotomeAvatar
            expression={avatarExpression}
            isListening={isListening}
            isSpeaking={isSpeaking}
            size="lg"
            className="animate-float"
          />
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col overflow-hidden px-4">
          {viewState === 'welcome' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-fade-in">
              <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to Neurotome
                </h1>
                <p className="text-muted-foreground">
                  Your compassionate AI companion for mental wellness. 
                  I'm here to listen, support, and guide you through 
                  relaxation and self-care.
                </p>
              </div>
              
              <Button 
                size="lg" 
                onClick={handleStartConversation}
                className="gap-2"
              >
                Begin Your Journey
              </Button>
              
              <CrisisResources compact />
            </div>
          )}
          
          {viewState === 'mood-check' && !currentMood && (
            <div className="flex-1 flex items-center justify-center animate-fade-in">
              <MoodSelector 
                selectedMood={currentMood}
                onMoodSelect={handleMoodSelect}
              />
            </div>
          )}
          
          {viewState === 'conversation' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <ConversationView 
                messages={messages}
                isLoading={isLoading}
                className="flex-1"
              />
            </div>
          )}
          
          {/* Breathing Exercise Overlay */}
          {showBreathing && (
            <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowBreathing(false)}
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </Button>
              <BreathingExercise 
                onComplete={() => {
                  setShowBreathing(false);
                  speak("Great job completing the breathing exercise. How do you feel now?");
                }}
              />
            </div>
          )}
        </div>
        
        {/* Voice Control Section */}
        {viewState !== 'welcome' && (
          <div className="p-6 flex flex-col items-center gap-4 bg-card/50 backdrop-blur-sm border-t border-border">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowBreathing(true)}
                className="rounded-full w-12 h-12"
                title="Breathing Exercise"
              >
                <Wind className="w-5 h-5" />
              </Button>
              
              <VoiceButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                isDisabled={!isSupported || isLoading}
                onPress={handleVoicePress}
                onStopSpeaking={stopSpeaking}
              />
              
              <div className="w-12 h-12" /> {/* Spacer for symmetry */}
            </div>
            
            {!isSupported && (
              <p className="text-xs text-destructive">
                Voice features are not supported in your browser.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
