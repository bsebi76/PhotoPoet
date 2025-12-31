
import React, { ChangeEvent } from 'react';
import { Camera, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageSelect: (data: ImageData) => void;
  currentImage: ImageData | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, currentImage }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      onImageSelect({
        base64: base64String,
        mimeType: file.type,
        previewUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 flex justify-center">
      {!currentImage ? (
        <label className="group relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-sage rounded-[2.5rem] cursor-pointer hover:bg-emerald-50/50 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-5 bg-emerald-100 rounded-full mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
              <UploadCloud className="w-12 h-12 text-emerald-800" strokeWidth={1.5} />
            </div>
            <p className="text-2xl text-sage-dark font-medium font-serif">Upload photo</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-white group animate-fade-in ring-1 ring-emerald-950/5 w-fit h-fit">
          {/* Frameless Image Container - Adjusts to image dimensions */}
          <div className="relative flex items-center justify-center max-w-full">
            <img 
              src={currentImage.previewUrl} 
              alt="Upload preview" 
              className="max-w-full h-auto max-h-[70vh] block rounded-[2rem]"
            />
          </div>
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
             <label className="px-8 py-3 bg-white/95 backdrop-blur-md rounded-full text-emerald-900 cursor-pointer flex items-center gap-3 hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl font-medium border border-emerald-50">
               <Camera size={20} className="text-emerald-700" />
               <span>Change Photo</span>
               <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
             </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
