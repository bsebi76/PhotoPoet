
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PoemDisplay from './components/PoemDisplay';
import LoadingScreen from './components/LoadingScreen';
import PoemLibrary from './components/PoemLibrary';
import { generatePoemFromImage, generateInspiration } from './services/geminiService';
import { ImageData, AppStatus, PoemStyle, VisualTheme } from './types';
import { Sparkles, ArrowRight, RotateCcw, Feather, Eye, Loader2, Palette } from 'lucide-react';

const STYLES: PoemStyle[] = ['Free Verse', 'Haiku', 'Sonnet', 'Limerick', 'Ode'];
const THEMES: VisualTheme[] = ['Serene', 'Midnight', 'Parchment', 'Watercolor'];

const App: React.FC = () => {
  const [image, setImage] = useState<ImageData | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [inspiration, setInspiration] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PoemStyle>('Free Verse');
  const [theme, setTheme] = useState<VisualTheme>('Serene');
  const [isInspirationLoading, setIsInspirationLoading] = useState(false);

  // Effect to apply theme class to body
  useEffect(() => {
    const classMap: Record<VisualTheme, string> = {
      Serene: '',
      Midnight: 'theme-midnight',
      Parchment: 'theme-parchment',
      Watercolor: 'theme-watercolor'
    };
    
    // Remove all theme classes first
    Object.values(classMap).forEach(cls => {
      if (cls) document.body.classList.remove(cls);
    });
    
    // Add the selected theme class
    const newClass = classMap[theme];
    if (newClass) document.body.classList.add(newClass);
  }, [theme]);

  const handleImageSelect = (data: ImageData) => {
    setImage(data);
    setPoem(null);
    setInspiration(null);
    setStatus(AppStatus.IMAGE_SELECTED);
    setError(null);
  };

  const handleGetInspiration = async () => {
    if (!image) return;
    setIsInspirationLoading(true);
    setError(null);
    try {
      const summary = await generateInspiration(image.base64, image.mimeType);
      setInspiration(summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsInspirationLoading(false);
    }
  };

  const startGeneration = useCallback(async () => {
    if (!image) return;
    
    setStatus(AppStatus.GENERATING);
    setError(null);
    
    try {
      const result = await generatePoemFromImage(image.base64, image.mimeType, selectedStyle);
      setPoem(result);
      setStatus(AppStatus.READY);
    } catch (err: any) {
      setError(err.message || "Failed to generate poem.");
      setStatus(AppStatus.IMAGE_SELECTED);
    }
  }, [image, selectedStyle]);

  const handleReset = () => {
    setImage(null);
    setPoem(null);
    setInspiration(null);
    setStatus(AppStatus.IDLE);
    setError(null);
    setSelectedStyle('Free Verse');
  };

  const navigateToView = (view: 'compose' | 'library') => {
    if (view === 'library') {
      setStatus(AppStatus.LIBRARY);
    } else {
      if (poem) setStatus(AppStatus.READY);
      else if (image) setStatus(AppStatus.IMAGE_SELECTED);
      else setStatus(AppStatus.IDLE);
    }
  };

  return (
    <div className="min-h-screen text-[var(--theme-text)] selection:bg-[var(--theme-accent)] transition-colors duration-500 pb-20">
      <Header 
        onNavigate={navigateToView} 
        currentView={status === AppStatus.LIBRARY ? 'library' : 'compose'}
      />

      <main className="container mx-auto max-w-4xl px-4">
        {status === AppStatus.LIBRARY ? (
          <PoemLibrary onClose={() => navigateToView('compose')} />
        ) : (
          <div className="space-y-12">
            
            <ImageUploader onImageSelect={handleImageSelect} currentImage={image} />

            {(status === AppStatus.IMAGE_SELECTED || status === AppStatus.IDLE) && image && (
              <div className="space-y-10 animate-fade-in">
                
                {/* Inspiration Section */}
                <div className="flex flex-col items-center gap-4">
                  {!inspiration ? (
                    <button
                      onClick={handleGetInspiration}
                      disabled={isInspirationLoading}
                      className={`shimmer-button flex items-center gap-2 px-8 py-3 bg-white border border-[var(--theme-border)] text-[var(--theme-text)] rounded-full hover:bg-[var(--theme-secondary)] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group`}
                    >
                      {isInspirationLoading ? (
                        <Loader2 className="animate-spin text-[var(--theme-accent)]" size={20} />
                      ) : (
                        <Eye size={20} className="group-hover:scale-110 transition-transform opacity-70" />
                      )}
                      <span className="font-medium">
                        {isInspirationLoading ? 'Reading the scene...' : 'Reveal Inspiration'}
                      </span>
                    </button>
                  ) : (
                    <div className="w-full max-w-lg bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-[2rem] p-8 relative overflow-hidden animate-soft-reveal text-center shadow-sm opacity-90">
                      <div className="flex items-center justify-center gap-2 mb-4 opacity-40 uppercase tracking-[0.2em] text-[10px] font-bold">
                        <div className="h-px w-6 bg-[var(--theme-accent)]"></div>
                        <span>The Muse's Insight</span>
                        <div className="h-px w-6 bg-[var(--theme-accent)]"></div>
                      </div>
                      <p className="italic text-xl leading-relaxed font-serif">
                        "{inspiration}"
                      </p>
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={40} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-8 justify-center">
                  {/* Style Selector */}
                  <div className="w-full max-w-xs mx-auto">
                    <div className="flex items-center gap-2 mb-4 opacity-60 uppercase tracking-widest text-xs font-bold justify-center">
                      <Feather size={14} />
                      <span>Verse Style</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {STYLES.map((style) => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(style)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            selectedStyle === style
                              ? 'bg-[var(--theme-text)] text-[var(--theme-bg)] border-[var(--theme-text)] shadow-md'
                              : 'bg-white/50 text-[var(--theme-text)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div className="w-full max-w-xs mx-auto">
                    <div className="flex items-center gap-2 mb-4 opacity-60 uppercase tracking-widest text-xs font-bold justify-center">
                      <Palette size={14} />
                      <span>Visual Theme</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {THEMES.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            theme === t
                              ? 'bg-[var(--theme-text)] text-[var(--theme-bg)] border-[var(--theme-text)] shadow-md'
                              : 'bg-white/50 text-[var(--theme-text)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col items-center gap-6">
                  <button
                    onClick={startGeneration}
                    className="group relative px-10 py-4 bg-[var(--theme-text)] text-[var(--theme-bg)] rounded-full text-xl font-medium overflow-hidden shadow-xl hover:opacity-90 transition-all flex items-center gap-3"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                    <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
                    <span>Write {selectedStyle}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    onClick={handleReset}
                    className="opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2 text-sm"
                  >
                    <RotateCcw size={14} />
                    <span>Start Over</span>
                  </button>
                </div>
              </div>
            )}

            {status === AppStatus.GENERATING && (
              <LoadingScreen />
            )}

            {error && (
              <div className="p-6 bg-red-50/10 border border-red-500/20 text-red-500 rounded-3xl max-w-md mx-auto text-center animate-fade-in">
                <p className="font-medium mb-2">Something went wrong</p>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={() => setStatus(AppStatus.IMAGE_SELECTED)}
                  className="mt-4 text-sm font-bold underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {status === AppStatus.READY && poem && (
              <div className="space-y-6">
                {inspiration && (
                   <div className="w-full max-w-lg mx-auto bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-3xl p-6 text-center animate-soft-reveal opacity-80">
                      <div className="flex items-center justify-center gap-2 mb-2 opacity-40 uppercase tracking-widest text-[10px] font-bold">
                        <Eye size={12} />
                        <span>The Inspiration</span>
                      </div>
                      <p className="italic text-md leading-relaxed font-serif">
                        "{inspiration}"
                      </p>
                   </div>
                )}
                <PoemDisplay 
                  poem={poem} 
                  inspiration={inspiration}
                  image={image}
                  onUpdate={setPoem} 
                  onRegenerate={startGeneration}
                  currentTheme={theme}
                />
                <div className="flex flex-col items-center gap-4">
                 <div className="opacity-40 text-xs font-medium tracking-widest uppercase">Style: {selectedStyle}</div>
                 <button 
                    onClick={handleReset}
                    className="px-8 py-3 rounded-full border border-[var(--theme-border)] text-[var(--theme-text)] hover:bg-[var(--theme-secondary)] transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <RotateCcw size={18} />
                    <span>Create Another Poem</span>
                  </button>
               </div>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="fixed top-[20%] left-[-10%] w-[40%] aspect-square bg-[var(--theme-accent)] opacity-10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[35%] aspect-square bg-[var(--theme-accent)] opacity-10 rounded-full blur-3xl pointer-events-none -z-10"></div>
    </div>
  );
};

export default App;
