
import React from 'react';
import { BookOpen, PenTool } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'compose' | 'library') => void;
  currentView: 'compose' | 'library';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="py-8 px-4 text-center relative">
      <div className="absolute top-8 right-4 md:right-8 flex gap-2 items-center">
        {/* Navigation Toggle */}
        <button
          onClick={() => onNavigate(currentView === 'compose' ? 'library' : 'compose')}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100/50 hover:bg-emerald-100 text-emerald-800 rounded-full transition-all text-sm font-medium border border-emerald-200/50 shadow-sm"
        >
          {currentView === 'compose' ? (
            <>
              <BookOpen size={16} />
              <span className="hidden sm:inline">My Library</span>
            </>
          ) : (
            <>
              <PenTool size={16} />
              <span className="hidden sm:inline">Compose</span>
            </>
          )}
        </button>
      </div>
      
      <h1 className="text-5xl md:text-6xl text-emerald-900 tracking-tight mb-2">
        PhotoPoet
      </h1>
      <p className="text-emerald-700/70 text-lg md:text-xl max-w-md mx-auto italic">
        Where your moments find their voice in poetry.
      </p>
      <div className="w-24 h-px bg-emerald-200 mx-auto mt-6"></div>
    </header>
  );
};

export default Header;