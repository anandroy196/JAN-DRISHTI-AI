import React, { useState, useEffect } from 'react';
import { WasteReport, District } from '../types';
import { fetchWasteReports, submitWasteReport, updateWasteStatus } from '../api';
import { 
  Trash2, AlertTriangle, CheckCircle2, Clock, 
  MapPin, Camera, RefreshCw, Send, Check, ShieldCheck, Filter, Search 
} from 'lucide-react';

interface WasteManagementSectionProps {
  districts?: District[];
  currentUserRole?: string;
}

export const WasteManagementSection: React.FC<WasteManagementSectionProps> = ({ districts = [], currentUserRole }) => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [stats, setStats] = useState({ total: 0, managed: 0, in_progress: 0, unmanaged: 0, managed_percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReportForm, setShowReportForm] = useState(false);

  // Form state
  const [location, setLocation] = useState('');
  const [districtId, setDistrictId] = useState(1);
  const [category, setCategory] = useState('Overflowing dustbins & single-use plastics');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [reporterName, setReporterName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Status update state for official
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Collection Scheduled');
  const [scheduledDate, setScheduledDate] = useState('2026-11-04');
  const [disposalMethod, setDisposalMethod] = useState('Transported to Sahnewal Solid Waste Cluster Compactor');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchWasteReports({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setReports(data.reports || []);
      setStats(data.stats || { total: 0, managed: 0, in_progress: 0, unmanaged: 0, managed_percentage: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitWasteReport({
        location,
        district_id: districtId,
        category,
        severity,
        description,
        photo_url: photoUrl,
        reported_by: reporterName || 'Local Resident'
      });
      setShowReportForm(false);
      setDescription('');
      setLocation('');
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number) => {
    try {
      await updateWasteStatus(id, {
        management_status: newStatus,
        scheduled_collection_date: scheduledDate,
        disposal_method: disposalMethod
      });
      setUpdatingId(null);
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const categories = [
    'Garbage piles',
    'Overflowing dustbins & single-use plastics',
    'Open dumping',
    'Waste blocking roads or drains',
    'Construction debris',
    'Public-space litter',
    'Waste near rivers, ponds, and water bodies',
    'Uncollected household waste',
    'Burning waste',
    'Potentially hazardous biomedical waste'
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Primary Action */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Solid Waste Detection &amp; Management Oversight
          </h1>
          <p className="text-xs text-slate-500">
            Full lifecycle monitoring: from citizen detection to collection, processing, and certified disposal.
          </p>
        </div>

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{showReportForm ? 'Cancel Report' : 'Report Unmanaged Waste'}</span>
        </button>
      </div>

      {/* Is Waste Being Managed Indicator Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Is the Waste Being Managed or Not?
            </h2>
            <p className="text-[11px] text-slate-500">
              Clear distinction between verified disposal, scheduled logistics, and unmanaged open dumps.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-slate-800">
            {stats.managed_percentage}% Clearance Efficiency
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <span className="text-[11px] font-semibold text-emerald-900 block">
              Managed &amp; Verified
            </span>
            <p className="text-2xl font-bold font-mono text-emerald-800">{stats.managed}</p>
            <span className="text-[10px] text-emerald-700">Disposal Confirmed</span>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
            <span className="text-[11px] font-semibold text-blue-900 block">
              Collection in Progress
            </span>
            <p className="text-2xl font-bold font-mono text-blue-800">{stats.in_progress}</p>
            <span className="text-[10px] text-blue-700">Truck Dispatched</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
            <span className="text-[11px] font-semibold text-amber-900 block">
              Unmanaged / Overdue
            </span>
            <p className="text-2xl font-bold font-mono text-amber-800">{stats.unmanaged}</p>
            <span className="text-[10px] text-amber-700">Awaiting Sanitation Nodal</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[11px] font-semibold text-slate-700 block">
              Total Recorded Reports
            </span>
            <p className="text-2xl font-bold font-mono text-slate-900">{stats.total}</p>
            <span className="text-[10px] text-slate-500">Audit Trail Enabled</span>
          </div>
        </div>
      </div>

      {/* New Waste Report Form */}
      {showReportForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900">
              Submit Waste Incident or Open Dump Report
            </h3>
            <p className="text-slate-500 text-[11px]">
              Provide landmark description and category to route directly to Panchayat Sanitation Inspector.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Specific Location Landmark *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Near Bhaini Sahib grain market shed"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                District *
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Waste Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Severity Level *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              >
                <option value="low">Low — Minor litter</option>
                <option value="medium">Medium — Overflowing bin</option>
                <option value="high">High — Blocking road/drain</option>
                <option value="critical">Critical — Hazardous/Biomedical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Incident Description &amp; Public Hazard Details *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe waste volume, stagnant smell, presence of cattle or water contamination..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowReportForm(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Save Waste Report</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-max">
        {(['all', 'Collection Scheduled', 'Work In Progress', 'Verified Resolved'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
              statusFilter === st ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st === 'all' ? 'All Reports' : st}
          </button>
        ))}
      </div>

      {/* Waste Reports Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading waste records...</div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-xl">
            No waste management records found for this view.
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {report.reference_id}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${
                      report.management_status === 'Verified Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : report.management_status === 'Work In Progress'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {report.management_status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Reported: {report.reported_date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 pt-1">
                    {report.category}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{report.location} · {report.district_name || 'Punjab'}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    "{report.description}"
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right text-xs">
                  <span className="text-[10px] text-slate-500 block">Severity Classification</span>
                  <span className="font-bold text-sm text-red-700 uppercase">
                    {report.severity} Priority
                  </span>
                </div>
              </div>

              {/* Lifecycle & Logistics Bar */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Responsible Sanitation Agency:
                  </span>
                  <span className="font-medium text-slate-800">{report.assigned_department}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Scheduled Collection:
                  </span>
                  <span className="font-mono font-medium text-slate-800">
                    {report.scheduled_collection_date || 'Awaiting Scheduling'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Disposal / Recycling Method:
                  </span>
                  <span className="font-medium text-emerald-800">
                    {report.disposal_method || 'Cluster Processing Facility'}
                  </span>
                </div>
              </div>

              {/* Official Action Drawer */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Assigned Officer: {report.assigned_officer || 'Sanitation Inspector'}
                </span>

                <button
                  onClick={() => setUpdatingId(updatingId === report.id ? null : report.id)}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs"
                >
                  {updatingId === report.id ? 'Close Workflow' : 'Officer Update Action →'}
                </button>
              </div>

              {updatingId === report.id && (
                <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 space-y-3 text-xs">
                  <span className="font-bold text-slate-900 block">
                    Update Waste Management Lifecycle Status
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">New Lifecycle State</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white"
                      >
                        <option value="Collection Scheduled">Collection Scheduled</option>
                        <option value="Work In Progress">Work In Progress</option>
                        <option value="Collected">Collected (In Transit)</option>
                        <option value="Processed or Disposed">Processed or Disposed</option>
                        <option value="Verified Resolved">Verified Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">Scheduled / Actual Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">Processing Facility</label>
                      <input
                        type="text"
                        value={disposalMethod}
                        onChange={(e) => setDisposalMethod(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(report.id)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs"
                  >
                    Commit Lifecycle Progression
                  </button>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
