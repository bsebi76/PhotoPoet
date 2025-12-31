
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Persistent state for volume and mute
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('lumina_volume');
    return saved ? parseFloat(saved) : 0.4; // Slightly lower default
  });
  
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('lumina_muted') === 'true';
  });

  // Handle Play/Pause logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Browsers require a user gesture before play() succeeds.
      // Since the user clicks the toggle button, this gesture is usually satisfied.
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Playback blocked or interrupted:", error);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle Volume and Mute updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('lumina_volume', volume.toString());
    localStorage.setItem('lumina_muted', isMuted.toString());
  }, [volume, isMuted]);

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <>
      {/* 
        One stable audio element for the lifetime of the component.
        Using a very reliable ambient source URL.
      */}
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
      
      {/* Floating Volume Controller - only visible when the master toggle is ON */}
      {isPlaying && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-emerald-100 p-2 pl-4 pr-5 rounded-full shadow-lg hover:shadow-xl transition-all group">
            <button 
              onClick={toggleMute}
              className={`transition-colors hover:scale-110 active:scale-95 ${isMuted ? 'text-emerald-400' : 'text-emerald-800'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>
            
            <div className="flex items-center gap-2 w-0 overflow-hidden group-hover:w-24 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
            </div>
            
            <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-tighter hidden group-hover:block">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      )}
      
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #065f46;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #065f46;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;
