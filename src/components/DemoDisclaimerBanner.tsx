import React from 'react';
import { AlertTriangle, PlayCircle, ShieldAlert } from 'lucide-react';

interface DemoDisclaimerBannerProps {
  onStartWalkthrough: () => void;
}

export const DemoDisclaimerBanner: React.FC<DemoDisclaimerBannerProps> = ({ onStartWalkthrough }) => {
  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600/40 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-slate-950" />
          <span className="font-semibold tracking-wide">
            DEMO DATA — NOT OFFICIAL GOVERNMENT RECORDS
          </span>
          <span className="hidden md:inline text-slate-900/80">·</span>
          <span className="hidden md:inline text-slate-900/80">
            Hackathon prototype for public fund transparency &amp; rural development verification.
          </span>
        </div>

        <button
          onClick={onStartWalkthrough}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md text-xs transition-colors shadow-xs whitespace-nowrap"
        >
          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Launch 10-Step Hackathon Demo</span>
        </button>
      </div>
    </div>
  );
};
