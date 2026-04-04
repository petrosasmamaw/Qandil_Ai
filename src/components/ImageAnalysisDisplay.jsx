'use client';

import { useState } from 'react';
import { FiCheck, FiClipboard, FiDownload, FiCamera, FiStar, FiZap } from 'react-icons/fi';

export default function ImageAnalysisDisplay({ analysis, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([analysis.analysis], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `image-analysis-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-lg border border-slate-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-1 flex items-center gap-2"><FiCamera size={24} /> Image Analysis</h3>
            <p className="text-gray-400 text-sm">
              Analyzed on {analysis.analyzedAt.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">File: {analysis.fileName}</p>
          </div>
          <div className="text-3xl text-yellow-500"><FiStar size={32} /></div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg border border-slate-700 max-h-96 overflow-y-auto">
        <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
          {analysis.analysis}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg flex items-start gap-3">
        <FiZap size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-200 text-sm">
          <span className="font-semibold\">Tip:</span> This analysis is your AI assistant's educational interpretation of the image. Use it as a starting point for your learning journey.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          {copied ? 
            <div className="flex items-center gap-2 text-green-600 hover:text-green-700"><FiCheck size={16} /> Copied!</div>
            : 
            <div className="flex items-center gap-2"><FiClipboard size={16} /> Copy Analysis</div>
          }
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 text-white"
        >
          <FiDownload size={18} /> Download
        </button>
        <button
          onClick={onDelete}
          className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          🔄 Analyze Another Image
        </button>
      </div>
    </div>
  );
}
