import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';

export const DocumentScanner: React.FC = () => {
  const { goBack } = useNavigateApp();
  const [scanning, setScanning] = useState(false);
  const [resultText, setResultText] = useState('');

  const triggerScan = () => {
    setScanning(true);
    setResultText('');
    
    setTimeout(() => {
      setScanning(false);
      setResultText(
        `[Document Extracted Summary]\n` +
        `TITLE: SmartLife Ecosystem Architecture\n` +
        `DATE: 2026-07-14\n\n` +
        `This manual outlines the architectural pipelines for the SmartLife mobile suite. ` +
        `Key components are modularized using TypeScript interfaces, React Context databases, ` +
        `and custom SVG analytics visualizations. Google ML Kit performs real-time OCR captures, ` +
        `while conversational nodes parse schedule prompts through Aura AI.`
      );
    }, 2500);
  };

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none bg-slate-950 text-white">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="text-xl font-black">Document OCR Scanner</h2>
          <p className="text-[10px] text-gray-400">Extract raw text outlines from journals and notes</p>
        </div>
      </div>

      {/* Viewfinder or results */}
      {scanning ? (
        <div className="flex-grow min-h-[350px] bg-slate-900 rounded-3xl relative border border-white/10 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 laser-scanner shadow-[0_0_12px_#22d3ee]" />
          <span className="material-symbols-outlined text-5xl text-cyan-400 animate-pulse">document_scanner</span>
          <p className="text-sm font-bold text-gray-300 mt-4 animate-pulse">Extracting document page text...</p>
        </div>
      ) : resultText ? (
        /* Extracted text display */
        <div className="flex-grow min-h-[350px] bg-slate-900 p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Parsed Text Blocks</h4>
            <textarea
              readOnly
              value={resultText}
              className="w-full h-64 bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 outline-none resize-none leading-relaxed"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setResultText('')}
              className="flex-1 py-3 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-xl text-center"
            >
              Scan Again
            </button>
            <button
              onClick={goBack}
              className="flex-grow py-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl text-center text-white"
            >
              Finish
            </button>
          </div>
        </div>
      ) : (
        /* Camera Ready state */
        <div className="flex-grow min-h-[350px] bg-slate-900 rounded-3xl relative border border-white/10 flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-indigo-500" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-indigo-500" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-indigo-500" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-indigo-500" />

          <span className="material-symbols-outlined text-5xl text-gray-600 mb-3">camera</span>
          <h4 className="font-bold text-sm text-gray-300">Ready to Capture</h4>
          <p className="text-xs text-gray-500 max-w-[220px] mx-auto mt-2 leading-relaxed">
            Align invoices, notebook schedules, or document charts to extract text lists.
          </p>

          <button
            onClick={triggerScan}
            className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30"
          >
            Scan Document
          </button>
        </div>
      )}

    </div>
  );
};
