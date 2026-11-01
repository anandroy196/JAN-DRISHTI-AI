import React from 'react';
import { Project, AnalyticsData } from '../types';
import { useI18n } from '../i18nContext';
import { 
  Building2, Landmark, CheckCircle2, Clock, AlertTriangle, 
  ArrowUpRight, ShieldCheck, ChevronRight, FileCheck, MapPin, 
  Search, FileText, Coins
} from 'lucide-react';

interface HomeSectionProps {
  analytics: AnalyticsData | null;
  projects: Project[];
  onNavigateToTab: (tab: string) => void;
  onSelectProject: (id: number) => void;
  onOpenGrievanceForm: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  analytics,
  projects,
  onNavigateToTab,
  onSelectProject,
  onOpenGrievanceForm
}) => {
  const { t, tStatus } = useI18n();
  const summary = analytics?.summary;

  const formatCrores = (val?: number) => {
    if (!val) return '₹0.00 Cr';
    const cr = val / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  };

  const formatLakhs = (val?: number) => {
    if (!val) return '₹0.0 L';
    const lk = val / 100000;
    return `₹${lk.toFixed(1)} Lakh`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'ongoing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'delayed':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 overflow-hidden bg-radial from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-8 sm:p-12 shadow-md">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
            <span>{t('appName')}</span>
            <span>·</span>
            <span>{t('tagline')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance leading-tight">
            {t('heroHeadline')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t('heroSubtext')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigateToTab('funds')}
              className="px-5 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              {t('exploreFunds')}
            </button>
            <button
              onClick={onOpenGrievanceForm}
              className="px-5 py-3 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all whitespace-nowrap"
            >
              {t('reportProblem')}
            </button>
            <button
              onClick={() => onNavigateToTab('my_complaints')}
              className="px-4 py-3 text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('navMyComplaints')} →</span>
            </button>
          </div>
        </div>
      </section>

      {/* Public Finance Overview derived from SQLite */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {t('navAnalytics')} &amp; Public Finance Overview
            </h2>
            <p className="text-xs text-slate-500">
              Computed live from verified district, block, and Gram Panchayat database records.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t('statAuditScore')}: <strong className="text-slate-900 tabular-nums">{summary?.completeness_score || 92}%</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t('statTotalSanctioned')}</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCrores(summary?.total_sanctioned)}
            </p>
            <span className="text-[11px] text-slate-400">Total approved public budget</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t('statFundsReleased')}</span>
              <Landmark className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCrores(summary?.total_released)}
            </p>
            <span className="text-[11px] text-slate-400">Transferred to executing agencies</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t('statRecordedSpent')}</span>
              <FileCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCrores(summary?.total_spent)}
            </p>
            <span className="text-[11px] text-slate-400">Voucher-verified contractor disbursements</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t('statActiveProjects')}</span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {summary?.total_projects || projects.length} Works
            </p>
            <span className="text-[11px] text-slate-400">Under continuous social monitoring</span>
          </div>
        </div>
      </section>

      {/* Featured Ongoing Development Works */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {t('navProjects')}
            </h2>
            <p className="text-xs text-slate-500">
              Live grassroots execution status with geo-tagged locations and financial records.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('projects')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{t('details')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((prj) => (
            <div
              key={prj.id}
              onClick={() => onSelectProject(prj.id)}
              className="group bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {prj.code}
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] font-medium border rounded-md capitalize ${getStatusBadge(prj.status)}`}>
                    {tStatus(prj.status)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {prj.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prj.panchayat_name || 'Gram Panchayat'}, {prj.district_name || 'Punjab'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Budget: <strong className="text-slate-900 font-mono tabular-nums">{formatLakhs(prj.sanctioned_amount)}</strong></span>
                  <span className="text-slate-500">Progress: <strong className="text-slate-900 font-mono tabular-nums">{prj.reported_progress_pct}%</strong></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, prj.reported_progress_pct))}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info & Verification Notice */}
      <footer className="border-t border-slate-200 pt-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-medium text-slate-700">
            {t('appName')} · {t('tagline')}
          </p>
          <p className="text-[11px]">
            Civic transparency portal compliant with social audit directives and Right to Information guidelines.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <button onClick={() => onNavigateToTab('my_complaints')} className="hover:text-emerald-700">
            {t('navMyComplaints')}
          </button>
          <button onClick={() => onNavigateToTab('funds')} className="hover:text-emerald-700">
            {t('navFunds')}
          </button>
          <button onClick={() => onNavigateToTab('grievances')} className="hover:text-emerald-700">
            {t('navGrievances')}
          </button>
          <button onClick={() => onNavigateToTab('monitoring')} className="hover:text-emerald-700">
            {t('navMonitoring')}
          </button>
        </div>
      </footer>

    </div>
  );
};
