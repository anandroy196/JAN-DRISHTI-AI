import React, { useState, useEffect } from 'react';
import { Anomaly } from '../types';
import { fetchAnomalies } from '../api';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, FileText, 
  Search, Filter, ExternalLink, ArrowRight, RefreshCw 
} from 'lucide-react';

interface AnomaliesSectionProps {
  onSelectProject: (id: number) => void;
}

export const AnomaliesSection: React.FC<AnomaliesSectionProps> = ({ onSelectProject }) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  useEffect(() => {
    fetchAnomalies()
      .then(setAnomalies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = anomalies.filter((a) => {
    return selectedSeverity === 'all' || a.severity === selectedSeverity;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'high':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Transparency &amp; Anomaly Detection Center
          </h1>
          <p className="text-xs text-slate-500">
            Explainable rule-based algorithms scanning financial drawdowns, milestone lags, and voucher variances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-medium">
            Rule-Based &amp; Statistical Invariant Checks
          </span>
        </div>
      </div>

      {/* Principles Disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
        <span className="font-semibold text-slate-900 block">
          Constitutional Principles of JanDrishti Anomaly Analysis:
        </span>
        <p>
          Detected discrepancies represent statistical variations or documentation thresholds requiring administrative inquiry. No automated claim of fraud or corruption is made without on-site judicial verification.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-max">
        {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
              selectedSeverity === sev
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {sev === 'all' ? `All Anomalies (${anomalies.length})` : `${sev} Severity`}
          </button>
        ))}
      </div>

      {/* Anomaly Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            Running invariant audits across all registered transactions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-xl">
            No active anomalies registered under the selected severity criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-2xs space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border capitalize ${getSeverityBadge(item.severity)}`}>
                      {item.severity} Risk
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Category: {item.category.replace('_', ' ')}
                    </span>
                    <span>·</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Detected: {item.detected_at}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                    {item.explanation}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 block">Variance Exposure</span>
                  <span className="font-mono font-bold text-base text-red-700">
                    {formatLakhs(item.financial_variance)}
                  </span>
                </div>
              </div>

              {/* Supporting Evidence Strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Supporting Voucher / Project Records:
                  </span>
                  <p className="font-mono text-slate-800 text-[11px] pt-0.5">
                    {item.supporting_records}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Prescribed Statutory Next Action:
                  </span>
                  <p className="text-slate-900 font-medium text-[11px] pt-0.5">
                    {item.suggested_action}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Detection Method:</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {item.detection_method}
                  </span>
                  <span>·</span>
                  <span className="capitalize text-slate-700 font-semibold">
                    Status: {item.review_status.replace('_', ' ')}
                  </span>
                </div>

                <button
                  onClick={() => onSelectProject(item.project_id)}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  <span>Inspect Linked Project Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
