
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  const messages = [
    "Observing the light...",
    "Finding the hidden rhythm...",
    "Weaving visual threads into verse...",
    "Almost there..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
      <div className="relative w-24 h-24 mb-8">
        {/* Simple rhythmic SVG animation */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-emerald-200"
          />
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeDasharray="60 190"
            className="text-emerald-800 animate-[spin_2s_linear_infinite]"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-xl text-emerald-900/60 italic font-serif transition-opacity duration-1000">
        {messages[step]}
      </p>
    </div>
  );
};

export default LoadingScreen;
