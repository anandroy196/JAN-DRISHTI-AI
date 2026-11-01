import React, { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { fetchAnalytics } from '../api';
import { 
  BarChart3, PieChart, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Landmark, Coins, FileCheck 
} from 'lucide-react';

interface AnalyticsSectionProps {
  onSelectProject: (id: number) => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ onSelectProject }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCrores = (val?: number) => {
    if (!val) return '₹0.00 Cr';
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  };

  const formatLakhs = (val?: number) => {
    if (!val) return '₹0.0 L';
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">
        Aggregating district analytics from SQLite database...
      </div>
    );
  }

  const { summary, status_distribution, district_allocations, department_allocations, delayed_projects, completeness } = data;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Public Expenditure &amp; Governance Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Data-driven visual breakdown of sanctioned grants, contractor disbursements, and delay audits.
          </p>
        </div>

        <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
          Dataset: Punjab Rural Engineering Division (Demo Cluster)
        </span>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 block">Total Sanctioned Grant</span>
          <p className="text-2xl font-bold font-mono text-slate-900">
            {formatCrores(summary.total_sanctioned)}
          </p>
          <span className="text-[11px] text-slate-400">Total Statutory Outlay</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 block">Funds Released to Works</span>
          <p className="text-2xl font-bold font-mono text-blue-700">
            {formatCrores(summary.total_released)}
          </p>
          <span className="text-[11px] text-slate-400">
            {Math.round((summary.total_released / (summary.total_sanctioned || 1)) * 100)}% Tranche Disbursal
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 block">Voucher Expenditure</span>
          <p className="text-2xl font-bold font-mono text-emerald-700">
            {formatCrores(summary.total_spent)}
          </p>
          <span className="text-[11px] text-slate-400">
            Remaining: <span className="font-mono">{formatCrores(summary.total_remaining)}</span>
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 block">Data Completeness Score</span>
          <p className="text-2xl font-bold font-mono text-slate-900">
            {summary.completeness_score}%
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">
            {completeness.verified_records} of {completeness.total_records} Verified
          </span>
        </div>
      </div>

      {/* Grid: Sanctioned vs Released vs Spent + District Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* District-wise Allocation Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                District-wise Public Allocation
              </h3>
              <p className="text-[11px] text-slate-500">
                Comparison of approved outlay vs recorded field expenditure.
              </p>
            </div>
            <Landmark className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4 pt-1">
            {district_allocations.map((d) => {
              const spentPct = Math.round((d.spent / (d.sanctioned || 1)) * 100);

              return (
                <div key={d.id} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-sm">
                      {d.district_name} District
                    </span>
                    <span className="font-mono font-medium text-slate-700">
                      Sanctioned: {formatCrores(d.sanctioned)} · Spent: <strong className="text-emerald-700">{formatCrores(d.spent)}</strong>
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 rounded-full"
                      style={{ width: `${Math.min(100, spentPct)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{d.project_count} Recorded Works</span>
                    <span>{spentPct}% Utilized</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Status Classification Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">
                Active monitoring across planned, ongoing, completed, and delayed works.
              </p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {status_distribution.map((st) => (
              <div key={st.status} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block capitalize">
                  {st.status} Works
                </span>
                <p className="text-2xl font-bold font-mono text-slate-900">
                  {st.count}
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Budget: {formatLakhs(st.total_sanctioned)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Delayed Projects Audit Rate:</span>
            <span className="font-mono font-bold text-amber-700">
              {delayed_projects.length} Triggered Alerts
            </span>
          </div>
        </div>

      </div>

      {/* Delayed Projects Risk Registry */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-2">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 block text-sm">
              Delayed Projects Statutory Audit Queue ({delayed_projects.length})
            </span>
            <span className="text-slate-500">
              Works past deadline or suffering milestone lag exceeding statutory thresholds.
            </span>
          </div>
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4">Code &amp; Name</th>
                <th className="py-2.5 px-4">District</th>
                <th className="py-2.5 px-4 text-right">Sanctioned</th>
                <th className="py-2.5 px-4 text-right">Spent to Date</th>
                <th className="py-2.5 px-4 text-center">Progress</th>
                <th className="py-2.5 px-4">Target Date</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {delayed_projects.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-mono font-bold text-slate-900 block text-[11px]">
                      {p.code}
                    </span>
                    <span className="text-slate-800 font-medium truncate block">
                      {p.name}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {p.district_name || 'Punjab'}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                    {formatLakhs(p.sanctioned_amount)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                    {formatLakhs(p.recorded_expenditure)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-amber-700">
                      {p.reported_progress_pct}%
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {p.expected_completion}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs"
                    >
                      Audit Record →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
