import React, { useEffect } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const OCRProcessing: React.FC = () => {
  const { currentRoute, navigate } = useNavigateApp();
  const { simulatedOcrScan } = useApp();
  
  const imageName = currentRoute.params?.imageName || 'receipt';

  useEffect(() => {
    let active = true;

    const runOcr = async () => {
      // Trigger the mock processing promise
      const parsedData = await simulatedOcrScan(imageName);
      if (active) {
        // Navigate to edit details page
        navigate('extracted_receipt', { receiptData: parsedData });
      }
    };

    runOcr();

    return () => {
      active = false;
    };
  }, [imageName, simulatedOcrScan, navigate]);

  return (
    <div className="flex-1 flex flex-col min-h-screen items-center justify-center bg-slate-950 text-white p-6 relative">
      
      <main className="w-full max-w-[400px] text-center z-10 glass-card rounded-[32px] p-8 border border-white/10 relative overflow-hidden bg-slate-900/80">
        
        {/* Receipt Mock Paper */}
        <div className="w-48 h-64 bg-slate-800 rounded-2xl mx-auto mb-8 relative border border-white/20 overflow-hidden shadow-inner flex flex-col justify-between p-4 text-left">
          
          {/* Laser Scanning Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 laser-scanner shadow-[0_0_12px_#22d3ee]" />

          {/* Dummy text lines mimicking receipt content */}
          <div className="space-y-3 opacity-30 mt-2">
            <div className="h-3 w-16 bg-white rounded" />
            <div className="h-2 w-28 bg-white rounded" />
            <div className="h-2 w-20 bg-white rounded" />
            <div className="border-t border-dashed border-white/40 my-2" />
            <div className="h-2 w-32 bg-white rounded" />
            <div className="h-2 w-24 bg-white rounded" />
            <div className="h-2 w-28 bg-white rounded" />
            <div className="border-t border-dashed border-white/40 my-2" />
            <div className="h-4 w-12 bg-white rounded self-end" />
          </div>
          
          <div className="text-[10px] text-center font-bold text-gray-500 tracking-wider">
            Google ML Kit Engine
          </div>
        </div>

        {/* Text descriptions */}
        <h3 className="text-xl font-black mb-2 animate-pulse text-cyan-400">Processing Receipt...</h3>
        <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
          Google ML Kit OCR is extracting merchant headers, purchase items, tax aggregates, and total figures...
        </p>

        {/* Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>

      </main>
      
    </div>
  );
};
