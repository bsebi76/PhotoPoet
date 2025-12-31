
import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Quote, ChevronRight, BookOpen, Download } from 'lucide-react';
import { SavedPoem } from '../types';

interface PoemLibraryProps {
  onClose: () => void;
}

const PoemLibrary: React.FC<PoemLibraryProps> = ({ onClose }) => {
  const [poems, setPoems] = useState<SavedPoem[]>([]);
  const [selectedPoem, setSelectedPoem] = useState<SavedPoem | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lumina_verse_library') || '[]');
    // Sort by date descending (newest first)
    const sorted = saved.sort((a: SavedPoem, b: SavedPoem) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setPoems(sorted);
  }, []);

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = poems.filter(p => p.id !== id);
    localStorage.setItem('lumina_verse_library', JSON.stringify(updated));
    setPoems(updated);
    if (selectedPoem?.id === id) setSelectedPoem(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadDoc = (p: SavedPoem) => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>PhotoPoet Composition</title>
        <style>
          body { font-family: 'Georgia', serif; line-height: 1.6; color: #1a1a1a; }
          .header { text-align: center; border-bottom: 2pt solid #064e3b; padding-bottom: 10pt; margin-bottom: 20pt; }
          .title-main { font-size: 28pt; color: #064e3b; margin-bottom: 0; }
          .poem-title { font-size: 22pt; color: #065f46; text-align: center; margin-bottom: 10pt; font-weight: bold; }
          .subtitle { font-size: 12pt; color: #065f46; font-style: italic; }
          .section-title { font-size: 14pt; color: #065f46; font-weight: bold; margin-top: 20pt; border-bottom: 1pt solid #eee; }
          .inspiration-box { background-color: #f0fdf4; border: 1pt solid #c1d4bb; padding: 15pt; margin-top: 10pt; font-style: italic; }
          .poem-content { font-size: 16pt; margin-top: 20pt; white-space: pre-wrap; color: #000; text-align: center; }
          .footer { margin-top: 50pt; text-align: center; font-size: 9pt; color: #9ca3af; border-top: 1pt solid #eee; padding-top: 10pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title-main">PhotoPoet</h1>
          <p class="subtitle">Where your moments find their voice</p>
        </div>
        ${p.title ? `<div class="poem-title">${p.title}</div>` : ''}
        ${p.inspiration ? `<div class="section-title">The Inspiration</div><div class="inspiration-box">"${p.inspiration}"</div>` : ''}
        <div class="section-title">The Composition</div>
        <div class="poem-content">${p.poem.replace(/\n/g, '<br>')}</div>
        <div class="footer">Generated with PhotoPoet &bull; ${new Date(p.date).toLocaleDateString()}</div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${p.title || 'PhotoPoet-Poem'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-800 text-white rounded-2xl shadow-lg">
            <BookOpen size={24} />
          </div>
          <h2 className="text-3xl font-serif text-emerald-900">Poem Library</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-emerald-700/60 hover:text-emerald-800 transition-colors text-sm font-medium"
        >
          Back to Compose
        </button>
      </div>

      {poems.length === 0 ? (
        <div className="bg-white/40 border border-dashed border-emerald-200 rounded-[2.5rem] p-16 text-center">
          <Quote className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
          <p className="text-xl text-emerald-800/60 italic font-serif">Your library is currently empty.</p>
          <p className="text-sm text-emerald-800/40 mt-2">Save a poem while composing to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {poems.map((p) => (
              <div 
                key={p.id}
                onClick={() => setSelectedPoem(p)}
                className={`group relative bg-white/60 backdrop-blur-sm p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md flex gap-4 ${selectedPoem?.id === p.id ? 'border-emerald-500 shadow-emerald-100 shadow-lg scale-[1.02]' : 'border-emerald-100 hover:border-emerald-200'}`}
              >
                {p.image && (
                   <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 shadow-inner">
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                   </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-800/40">
                      <Calendar size={12} />
                      <span>{formatDate(p.date)}</span>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(p.id, e)}
                      className="p-1.5 text-emerald-800/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Poem"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {p.title && (
                    <h3 className="text-md font-bold text-emerald-900 mb-1 font-serif truncate">{p.title}</h3>
                  )}
                  <p className="text-emerald-900 line-clamp-2 font-serif italic mb-2 leading-relaxed opacity-80 text-sm">
                    {p.poem}
                  </p>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1 text-emerald-800/60 text-[10px] italic truncate max-w-[80%]">
                        <Quote size={8} className="shrink-0" />
                        <span className="truncate">{p.inspiration || "A silent moment..."}</span>
                     </div>
                     <ChevronRight size={14} className={`text-emerald-300 transition-transform ${selectedPoem?.id === p.id ? 'translate-x-1' : ''}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            {selectedPoem ? (
              <div className="sticky top-8 bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-emerald-100 shadow-xl animate-fade-in min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-emerald-50 pb-4">
                   <div className="text-xs font-bold uppercase tracking-widest text-emerald-800/40">
                      Archived {formatDate(selectedPoem.date)}
                   </div>
                   <button 
                    onClick={() => handleDownloadDoc(selectedPoem)}
                    className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-full transition-colors"
                    title="Export as .doc"
                   >
                     <Download size={20} />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
                  {selectedPoem.image && (
                    <div className="w-full mb-8 rounded-3xl overflow-hidden shadow-lg border border-emerald-50 bg-white">
                      <img src={selectedPoem.image} alt="Original inspiration" className="w-full h-auto object-contain max-h-[300px]" />
                    </div>
                  )}
                  
                  {selectedPoem.title && (
                    <h2 className="text-2xl md:text-3xl font-serif text-emerald-900 text-center mb-6">{selectedPoem.title}</h2>
                  )}
                  
                  <p className="text-xl text-emerald-900 whitespace-pre-wrap font-serif italic leading-relaxed text-center mb-8">
                    {selectedPoem.poem}
                  </p>

                  {selectedPoem.inspiration && (
                    <div className="mt-4 pt-6 border-t border-emerald-50 italic text-emerald-800/50 text-sm text-center">
                      &ldquo;{selectedPoem.inspiration}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-emerald-50/30 rounded-[2.5rem] border border-dashed border-emerald-100">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-300 mb-4">
                  <BookOpen size={32} />
                </div>
                <p className="text-emerald-800/40 italic font-serif">Select a verse to read in full</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Viewer */}
      {selectedPoem && (
        <div className="md:hidden fixed inset-0 z-50 bg-white animate-fade-in flex flex-col">
          <div className="p-6 border-b border-emerald-50 flex justify-between items-center">
             <button onClick={() => setSelectedPoem(null)} className="text-emerald-800 font-medium flex items-center gap-1">
                <ChevronRight size={18} className="rotate-180" />
                <span>Library</span>
             </button>
             <button onClick={() => handleDownloadDoc(selectedPoem)} className="p-2 text-emerald-800 bg-emerald-50 rounded-full">
                <Download size={20} />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
            {selectedPoem.image && (
              <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-md border border-emerald-50">
                <img src={selectedPoem.image} alt="" className="w-full h-auto" />
              </div>
            )}
            {selectedPoem.title && (
               <h2 className="text-2xl font-serif text-emerald-900 mb-6 text-center">{selectedPoem.title}</h2>
            )}
            <p className="text-2xl text-emerald-900 whitespace-pre-wrap font-serif italic leading-relaxed mb-12 text-center">
              {selectedPoem.poem}
            </p>
            {selectedPoem.inspiration && (
              <p className="italic text-emerald-800/50 text-sm text-center pb-12">
                &ldquo;{selectedPoem.inspiration}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemLibrary;
