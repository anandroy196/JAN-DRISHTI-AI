import React, { useState, useEffect } from 'react';
import { Project, Complaint, MonitoringAnalysis, Anomaly, UserRole } from '../types';
import { fetchProjectDetail, updateProjectMilestone } from '../api';
import { 
  X, Building2, MapPin, Calendar, CheckCircle2, AlertTriangle, 
  ExternalLink, FileText, Download, UserCheck, ShieldAlert, 
  TrendingUp, RefreshCw 
} from 'lucide-react';

interface ProjectDetailModalProps {
  projectId: number | null;
  onClose: () => void;
  onOpenReportModal: (id: number) => void;
  currentUserRole: UserRole;
  onProjectUpdated?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  projectId,
  onClose,
  onOpenReportModal,
  currentUserRole,
  onProjectUpdated
}) => {
  const [data, setData] = useState<{
    project: Project;
    calculated: {
      remaining_funds: number;
      disbursed_percentage: number;
      expenditure_percentage: number;
      progress_discrepancy: number;
    };
    complaints: Complaint[];
    audits: MonitoringAnalysis[];
    anomalies: Anomaly[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newProgress, setNewProgress] = useState(0);
  const [newExpenditure, setNewExpenditure] = useState(0);
  const [updateNote, setUpdateNote] = useState('');

  useEffect(() => {
    if (projectId) {
      loadDetails();
    }
  }, [projectId]);

  const loadDetails = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetchProjectDetail(projectId);
      setData(res);
      setNewProgress(res.project.reported_progress_pct);
      setNewExpenditure(res.project.recorded_expenditure);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setIsUpdating(true);
    try {
      await updateProjectMilestone(projectId, {
        reported_progress_pct: Number(newProgress),
        recorded_expenditure: Number(newExpenditure),
        note: updateNote
      });
      setShowUpdateForm(false);
      await loadDetails();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to update milestone');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!projectId) return null;

  const formatLakhs = (val?: number) => {
    if (val === undefined) return '₹0.00 L';
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
              {data?.project.code || 'JD-PRJ'}
            </span>
            <span className="text-xs text-slate-400 capitalize">
              {data?.project.status} Project Audit Record
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReportModal(projectId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Audit Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Fetching project vouchers and inspection history...
            </div>
          ) : !data ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              Project record unavailable.
            </div>
          ) : (
            <>
              {/* Title & Core Meta */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{data.project.panchayat_name}, Block {data.project.block_name}, District {data.project.district_name}</span>
                  <span>·</span>
                  <span>State: {data.project.state}</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-snug">
                  {data.project.name}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {data.project.description}
                </p>
              </div>

              {/* Financial Ledger Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500 block">Sanctioned Amount</span>
                  <p className="text-base font-bold font-mono text-slate-900">
                    {formatLakhs(data.project.sanctioned_amount)}
                  </p>
                  <span className="text-[10px] text-slate-400">Approved Budget</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500 block">Funds Released</span>
                  <p className="text-base font-bold font-mono text-blue-700">
                    {formatLakhs(data.project.released_amount)}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {data.calculated.disbursed_percentage}% of Sanction
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500 block">Disbursed Expenditure</span>
                  <p className="text-base font-bold font-mono text-emerald-700">
                    {formatLakhs(data.project.recorded_expenditure)}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {data.calculated.expenditure_percentage}% Spent
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500 block">Remaining Fund</span>
                  <p className="text-base font-bold font-mono text-slate-700">
                    {formatLakhs(data.calculated.remaining_funds)}
                  </p>
                  <span className="text-[10px] text-slate-400">Balance in Treasury</span>
                </div>
              </div>

              {/* Physical vs Financial Progress Comparison Bar */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    Physical Milestone vs Recorded Expenditure
                  </span>
                  <span className="font-mono text-slate-600">
                    Physical: <strong>{data.project.reported_progress_pct}%</strong> vs Spend: <strong>{data.calculated.expenditure_percentage}%</strong>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${data.project.status === 'delayed' ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.min(100, data.project.reported_progress_pct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Started: {data.project.start_date}</span>
                    <span>Target: {data.project.expected_completion}</span>
                    <span>Actual: {data.project.actual_completion || 'In Progress'}</span>
                  </div>
                </div>

                {/* Discrepancy indicator if variance exists */}
                {Math.abs(data.calculated.progress_discrepancy) > 10 && (
                  <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      Variance Alert: Progress rate differs from fund draw by {Math.abs(data.calculated.progress_discrepancy)}%. Automated audit trigger initiated.
                    </span>
                  </div>
                )}
              </div>

              {/* Official Update Action for Authorized Roles */}
              {(currentUserRole === 'official' || currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Authorized Officer Actions</span>
                    </div>
                    <button
                      onClick={() => setShowUpdateForm(!showUpdateForm)}
                      className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      {showUpdateForm ? 'Cancel Update' : 'Record Milestone / Voucher'}
                    </button>
                  </div>

                  {showUpdateForm && (
                    <form onSubmit={handleUpdateSubmit} className="pt-2 border-t border-slate-100 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">
                            New Progress Percentage (0 - 100%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newProgress}
                            onChange={(e) => setNewProgress(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">
                            Total Recorded Expenditure (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={newExpenditure}
                            onChange={(e) => setNewExpenditure(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Official Inspection / Voucher Notes
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sub-grade compaction verified by JE on site"
                          value={updateNote}
                          onChange={(e) => setUpdateNote(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition-colors"
                      >
                        {isUpdating ? 'Saving Record...' : 'Submit Official Record'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Contractor & Scheme Particulars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">
                    Contractor &amp; Procurement Details
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contractor:</span>
                    <span className="font-semibold text-slate-900">{data.project.contractor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GSTIN / ID:</span>
                    <span className="font-mono text-slate-800">{data.project.contractor_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid to Contractor:</span>
                    <span className="font-mono font-medium text-emerald-700">{formatLakhs(data.project.paid_to_contractor)}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">
                    Government Scheme &amp; Verification
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-900">{data.project.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheme:</span>
                    <span className="font-medium text-slate-900">{data.project.scheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Public Portal:</span>
                    <a
                      href={data.project.official_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>{data.project.source_name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Associated Grievances & Audits */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Citizen Grievances &amp; Field Inquiries ({data.complaints.length})
                </h3>
                {data.complaints.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded border border-slate-100">
                    No active citizen complaints filed against this project.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.complaints.map((c) => (
                      <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">{c.reference_id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                            {c.status}
                          </span>
                        </div>
                        <p className="text-slate-700">{c.description}</p>
                        <span className="text-[10px] text-slate-400 block">
                          Reported by {c.citizen_name} on {c.submitted_at}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>DEMO DATA — NOT OFFICIAL GOVERNMENT RECORDS</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Close Record
          </button>
        </div>

      </div>
    </div>
  );
};
