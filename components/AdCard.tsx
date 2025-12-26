
import React, { useState } from 'react';
import { AdVariation } from '../types';
import { Button } from './Button';

interface AdCardProps {
  variation: AdVariation;
}

export const AdCard: React.FC<AdCardProps> = ({ variation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `${variation.headline}\n\n${variation.content}\n\n${variation.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
          {variation.platform}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="text-xs h-8 px-2"
        >
          {copied ? 'Copied!' : (
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              Copy
            </div>
          )}
        </Button>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
        {variation.headline}
      </h3>

      <div className="text-gray-600 text-sm mb-6 whitespace-pre-wrap leading-relaxed">
        {variation.content}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-tighter">Call to Action</div>
        <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 font-medium text-blue-700 text-center">
          {variation.cta}
        </div>
      </div>
    </div>
  );
};
