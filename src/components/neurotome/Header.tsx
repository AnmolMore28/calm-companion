import React from 'react';
import { cn } from '@/lib/utils';
import { Brain, Menu, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CrisisResources from './CrisisResources';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header 
      className={cn(
        'flex items-center justify-between px-4 py-3',
        'bg-card/80 backdrop-blur-sm border-b border-border',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-gradient-to-br from-primary to-accent">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">Neurotome</span>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Crisis Resources Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <HelpCircle className="w-5 h-5" />
              <span className="sr-only">Crisis Resources</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Support Resources</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <CrisisResources />
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-4">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Brain className="w-4 h-4" />
                Home
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                Mood History
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                Breathing Exercises
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                Settings
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
