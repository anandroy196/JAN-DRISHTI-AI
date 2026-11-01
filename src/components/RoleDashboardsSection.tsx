import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, Project, Complaint, Anomaly } from '../types';
import { fetchProjects, fetchComplaints, fetchAnomalies, fetchAuditLogs } from '../api';
import { 
  UserCheck, Shield, Building2, AlertTriangle, CheckCircle2, 
  FileText, Clock, ArrowRight, Settings, Activity, Database, Lock 
} from 'lucide-react';

interface RoleDashboardsSectionProps {
  currentUser: UserProfile;
  onSelectRole: (role: UserRole) => void;
  onSelectProject: (id: number) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenGrievanceForm: () => void;
  onOpenReportModal: (id: number) => void;
}

export const RoleDashboardsSection: React.FC<RoleDashboardsSectionProps> = ({
  currentUser,
  onSelectRole,
  onSelectProject,
  onNavigateToTab,
  onOpenGrievanceForm,
  onOpenReportModal
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchComplaints(), fetchAnomalies(), fetchAuditLogs()]).then(
      ([p, c, a, l]) => {
        setProjects(p);
        setComplaints(c);
        setAnomalies(a);
        setAuditLogs(l);
      }
    );
  }, []);

  const roles: Array<{ id: UserRole; name: string; desc: string }> = [
    { id: 'citizen', name: 'Citizen Dashboard', desc: 'Track local works, file grievances, rate verified resolutions' },
    { id: 'official', name: 'Government Official', desc: 'Update milestones, enter expenditure vouchers, review complaints' },
    { id: 'admin', name: 'District Administrator', desc: 'Inter-block allocations, delay escalations, contractor notices' },
    { id: 'superadmin', name: 'System Administrator', desc: 'Security auditing, role management, data-source feeds' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Role Switcher */}
      <div className="border-b border-slate-200 pb-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Role-Based Civic Operating Console
            </h1>
            <p className="text-xs text-slate-500">
              Demonstrating secure, server-enforced access boundaries across governance tiers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Active Session:</span>
            <span className="px-2.5 py-1 bg-slate-900 text-white rounded font-mono capitalize">
              {currentUser.full_name} ({currentUser.role})
            </span>
          </div>
        </div>

        {/* Role Switching Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {roles.map((r) => {
            const isCurrent = currentUser.role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>{r.name}</span>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>
                <p className={`text-[11px] line-clamp-1 ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>
                  {r.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role 1: Citizen View */}
      {currentUser.role === 'citizen' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-emerald-950">
            <div>
              <span className="font-bold text-sm block">Citizen Portal: Gram Sabha Bhaini Sahib</span>
              <p className="text-emerald-800 pt-0.5">
                Logged in as <strong>{currentUser.full_name}</strong>. Access to public fund explorer, complaint lodgment, and local project reviews.
              </p>
            </div>
            <button
              onClick={onOpenGrievanceForm}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs whitespace-nowrap"
            >
              Lodge Village Grievance
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                My Community Tracked Projects ({projects.slice(0, 3).length})
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 3).map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span className="truncate">{p.name}</span>
                      <span className="font-mono text-emerald-700">{p.reported_progress_pct}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">Code: {p.code} · Dept: {p.department}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                My Submitted Grievances ({complaints.slice(0, 2).length})
              </h3>
              <div className="space-y-2">
                {complaints.slice(0, 2).map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-900">{c.reference_id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-slate-700 line-clamp-1">{c.description}</p>
                    <span className="text-[10px] text-slate-400 block">Filed on {c.submitted_at}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role 2: Government Official View */}
      {currentUser.role === 'official' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-950">
            <div>
              <span className="font-bold text-sm block">Officer Workspace: Public Works Department (Rural)</span>
              <p className="text-amber-900 pt-0.5">
                Logged in as <strong>{currentUser.full_name}</strong> ({currentUser.designation}). Permissions granted: Milestone Progress Entry, Contractor Voucher Submission.
              </p>
            </div>
            <button
              onClick={() => onSelectProject(1)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shadow-xs whitespace-nowrap"
            >
              Update Project Milestone
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Assigned Development Works Requiring Milestone Input
            </h3>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3">Contractor</th>
                    <th className="py-2.5 px-3">Progress</th>
                    <th className="py-2.5 px-3">Disbursed</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.slice(0, 4).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 max-w-xs truncate font-medium text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.contractor_name}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{p.reported_progress_pct}%</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-700">₹{(p.recorded_expenditure / 100000).toFixed(1)} L</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-medium"
                        >
                          Record Voucher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Role 3: District Administrator View */}
      {currentUser.role === 'admin' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-blue-950">
            <div>
              <span className="font-bold text-sm block">District Executive Console: Ludhiana Administration</span>
              <p className="text-blue-900 pt-0.5">
                Logged in as <strong>{currentUser.full_name}</strong> (Additional Deputy Commissioner Development). Overview across all 18 blocks.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('analytics')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-xs whitespace-nowrap"
            >
              Review Inter-Block Allocation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Urgent Escalation Queue ({anomalies.length} Flagged)
              </h3>
              <div className="space-y-2">
                {anomalies.map((a) => (
                  <div key={a.id} className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-red-950">
                      <span>{a.title}</span>
                      <span className="font-mono text-red-700">₹{(a.financial_variance / 100000).toFixed(1)} L</span>
                    </div>
                    <p className="text-red-900 text-[11px]">{a.suggested_action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Pending Grievances Awaiting Department Notices
              </h3>
              <div className="space-y-2">
                {complaints.filter(c => c.status !== 'Resolved').map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="font-mono text-slate-900">{c.reference_id}</span>
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role 4: System Admin View */}
      {currentUser.role === 'superadmin' && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-purple-950">
            <div>
              <span className="font-bold text-sm block">State Mission Director &amp; Security Console</span>
              <p className="text-purple-900 pt-0.5">
                Logged in as <strong>{currentUser.full_name}</strong>. System status: All SQLite tables synchronized. Gemini Vision API active.
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-700 text-white font-mono rounded text-xs">
              Uptime: 99.98%
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              System Audit Logs &amp; Cryptographic Trace
            </h3>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Action Code</th>
                    <th className="py-2.5 px-3">Entity</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{log.user_role}</td>
                      <td className="py-2.5 px-3 text-blue-700">{log.action}</td>
                      <td className="py-2.5 px-3 text-slate-600">{log.entity_type} ({log.entity_id})</td>
                      <td className="py-2.5 px-3 font-sans text-xs text-slate-700 max-w-sm truncate">{log.details}</td>
                      <td className="py-2.5 px-3 text-right text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
