
import React, { useState } from 'react';
import { Edit3, Check, Copy, Share2, RefreshCw, Twitter, MessageCircle, X, Facebook, Bookmark, BookmarkCheck } from 'lucide-react';
import { VisualTheme, ImageData } from '../types';

interface PoemDisplayProps {
  poem: string;
  inspiration: string | null;
  image: ImageData | null;
  onUpdate: (newPoem: string) => void;
  onRegenerate: () => void;
  currentTheme?: VisualTheme;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, inspiration, image, onUpdate, onRegenerate, currentTheme = 'Serene' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPoem, setEditedPoem] = useState(poem);
  const [title, setTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleSave = () => {
    onUpdate(editedPoem);
    setIsEditing(false);
  };

  const handleCopy = () => {
    const textToCopy = `${title ? title + '\n\n' : ''}${inspiration ? `Inspiration: ${inspiration}\n\n` : ''}${poem}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = () => {
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
        ${title ? `<div class="poem-title">${title}</div>` : ''}
        ${inspiration ? `<div class="section-title">The Inspiration</div><div class="inspiration-box">"${inspiration}"</div>` : ''}
        <div class="section-title">The Composition</div>
        <div class="poem-content">${poem.replace(/\n/g, '<br>')}</div>
        <div class="footer">Generated with PhotoPoet &bull; ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'PhotoPoet-Poem'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveAndExport = () => {
    const savedPoems = JSON.parse(localStorage.getItem('lumina_verse_library') || '[]');
    const newEntry = {
      id: Date.now(),
      title: title.trim() || undefined,
      poem: poem,
      inspiration: inspiration,
      image: image?.previewUrl,
      date: new Date().toISOString()
    };
    localStorage.setItem('lumina_verse_library', JSON.stringify([newEntry, ...savedPoems]));
    handleDownloadDoc();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleNativeShare = async () => {
    const shareText = `${title ? title + '\n\n' : ''}${inspiration ? `Inspiration: ${inspiration}\n\n` : ''}${poem}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'PhotoPoet Poem',
          text: shareText,
          url: window.location.href,
        });
        return true;
      } catch (error) {
        setShowShareMenu(true);
        return false;
      }
    } else {
      setShowShareMenu(true);
      return false;
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`"${title || 'A new verse'}" from PhotoPoet:\n\n${poem.substring(0, 180)}...`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`*${title || 'PhotoPoet Composition'}*\n\n${poem}\n\nShared via PhotoPoet`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-in pb-12 relative">
      <div className={`bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-[var(--theme-border)] relative overflow-hidden transition-all duration-500`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-accent)] opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--theme-accent)] opacity-10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <span className="opacity-40 text-sm font-medium tracking-widest uppercase">The Composition</span>
            <div className="flex gap-2">
              <button 
                onClick={onRegenerate}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Regenerate"
              >
                <RefreshCw size={20} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 hover:bg-white/20 rounded-full transition-colors ${isEditing ? 'bg-white/30' : ''}`}
                title="Edit Poem"
              >
                <Edit3 size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="mb-8 group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your poem a title..."
              className="w-full bg-transparent border-b border-[var(--theme-accent)]/30 focus:border-[var(--theme-accent)] focus:ring-0 transition-all text-center text-2xl md:text-3xl font-serif text-[var(--theme-text)] placeholder:opacity-30 py-2"
            />
          </div>

          {isEditing ? (
            <textarea
              value={editedPoem}
              onChange={(e) => setEditedPoem(e.target.value)}
              className="w-full h-80 bg-white/20 p-6 rounded-2xl border-none focus:ring-2 focus:ring-[var(--theme-accent)] text-[var(--theme-text)] text-lg leading-relaxed font-serif resize-none backdrop-blur-sm"
            />
          ) : (
            <div className="text-[var(--theme-text)] text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-serif italic text-center">
              {poem}
            </div>
          )}

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--theme-text)] text-[var(--theme-bg)] rounded-full hover:opacity-90 transition-all shadow-md"
              >
                <Check size={18} />
                <span>Finish Editing</span>
              </button>
            </div>
          )}

          {!isEditing && (
            <div className="mt-12 pt-8 border-t border-[var(--theme-border)]/30 flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-[var(--theme-text)] hover:bg-white/30 transition-all shadow-sm border border-[var(--theme-border)]"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button 
                onClick={handleSaveAndExport}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all shadow-sm border ${saved ? 'bg-[var(--theme-text)] text-[var(--theme-bg)] border-[var(--theme-text)]' : 'bg-white/20 backdrop-blur-sm text-[var(--theme-text)] border-[var(--theme-border)] hover:bg-white/30'}`}
              >
                {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                <span>{saved ? 'Saved & Exported' : 'Save Poem'}</span>
              </button>

              <button 
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-8 py-2.5 bg-[var(--theme-text)] text-[var(--theme-bg)] rounded-full hover:opacity-90 transition-all shadow-md"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showShareMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className="bg-[var(--theme-bg)] rounded-[2rem] p-8 max-w-xs w-full shadow-2xl border border-[var(--theme-border)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-[var(--theme-text)] italic">Share Verse</h3>
              <button onClick={() => setShowShareMenu(false)} className="opacity-40 hover:opacity-100 transition-opacity">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { shareToTwitter(); setShowShareMenu(false); }}
                className="flex items-center gap-3 w-full p-4 rounded-2xl bg-[#000000] text-white hover:opacity-80 transition-all"
              >
                <Twitter size={20} />
                <span>Twitter / X</span>
              </button>
              <button 
                onClick={() => { shareToFacebook(); setShowShareMenu(false); }}
                className="flex items-center gap-3 w-full p-4 rounded-2xl bg-[#1877F2] text-white hover:opacity-80 transition-all"
              >
                <Facebook size={20} />
                <span>Facebook</span>
              </button>
              <button 
                onClick={() => { shareToWhatsApp(); setShowShareMenu(false); }}
                className="flex items-center gap-3 w-full p-4 rounded-2xl bg-[#25D366] text-white hover:opacity-80 transition-all"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </button>
              <button 
                onClick={() => { handleCopy(); setShowShareMenu(false); }}
                className="flex items-center gap-3 w-full p-4 rounded-2xl bg-[var(--theme-secondary)] text-[var(--theme-text)] hover:opacity-80 transition-all"
              >
                <Copy size={20} />
                <span>Copy to Clipboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemDisplay;
