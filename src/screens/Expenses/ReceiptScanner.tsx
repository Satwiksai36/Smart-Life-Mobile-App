import React, { useRef, useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';

export const ReceiptScanner: React.FC = () => {
  const { navigate, goBack } = useNavigateApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(true);

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Navigate to OCR processing screen passing file name
      navigate('ocr_processing', { imageName: file.name });
    }
  };

  const captureMockPhoto = (type: string) => {
    // Navigate with a mock category name to retrieve preset items
    navigate('ocr_processing', { imageName: type });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none bg-slate-950 text-white">
      
      {/* 1. Header */}
      <div className="flex items-center gap-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="text-xl font-black">Receipt Scanner</h2>
          <p className="text-[10px] text-gray-400">Capture invoices via Google ML Kit OCR</p>
        </div>
      </div>

      {/* 2. Camera Viewfinder Mockup */}
      <div className="flex-1 min-h-[350px] relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col items-center justify-center">
        
        {/* Frame Guideline Angles */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-[#3525cd] rounded-tl-lg" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-[#3525cd] rounded-tr-lg" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-[#3525cd] rounded-bl-lg" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-[#3525cd] rounded-br-lg" />

        {/* Viewfinder Gridlines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15 pointer-events-none">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Inner instructions */}
        <div className="z-10 text-center px-6 space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#06b6d4] animate-pulse">qr_code_scanner</span>
          <p className="text-sm font-bold text-gray-300">Align receipt within boundaries</p>
          <p className="text-xs text-gray-500 max-w-[240px] mx-auto">Ensure text is bright, readable, and covers the full merchant summary.</p>
        </div>

        {/* Quick select buttons for fast mock scanning demo */}
        <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2 z-20">
          <button 
            type="button"
            onClick={() => captureMockPhoto('coffee')}
            className="bg-black/60 hover:bg-black/80 text-[10px] font-bold py-2 rounded-xl border border-white/10"
          >
            ☕ Starbucks
          </button>
          <button 
            type="button"
            onClick={() => captureMockPhoto('uber')}
            className="bg-black/60 hover:bg-black/80 text-[10px] font-bold py-2 rounded-xl border border-white/10"
          >
            🚗 Uber Ride
          </button>
          <button 
            type="button"
            onClick={() => captureMockPhoto('utility')}
            className="bg-black/60 hover:bg-black/80 text-[10px] font-bold py-2 rounded-xl border border-white/10"
          >
            💡 Water Bill
          </button>
        </div>
      </div>

      {/* 3. Capture Action Bar */}
      <div className="flex justify-around items-center py-4 bg-slate-900/60 rounded-2xl border border-white/10">
        
        {/* Gallery upload */}
        <button 
          onClick={triggerFileUpload}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">photo_library</span>
          <span className="text-[10px] font-bold">Gallery</span>
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Major Shutter Button */}
        <button 
          onClick={() => captureMockPhoto('wholefoods')}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
          title="Shutter click"
        >
          <div className="w-13 h-13 rounded-full border-2 border-slate-950 bg-white" />
        </button>

        {/* Torch Toggle */}
        <button 
          onClick={() => alert("Mock flashlight toggled.")}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">flashlight_on</span>
          <span className="text-[10px] font-bold">Flashlight</span>
        </button>

      </div>

    </div>
  );
};
