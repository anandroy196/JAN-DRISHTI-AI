import React, { useState, useEffect } from 'react';
import { Project, Complaint, MonitoringAnalysis } from '../types';
import { fetchProjectDetail } from '../api';
import { X, Printer, Download, CheckCircle2, ShieldAlert, Building2 } from 'lucide-react';

interface ProjectTransparencyReportModalProps {
  projectId: number | null;
  onClose: () => void;
}

export const ProjectTransparencyReportModal: React.FC<ProjectTransparencyReportModalProps> = ({
  projectId,
  onClose
}) => {
  const [data, setData] = useState<{
    project: Project;
    calculated: {
      remaining_funds: number;
      disbursed_percentage: number;
      expenditure_percentage: number;
    };
    complaints: Complaint[];
    audits: MonitoringAnalysis[];
  } | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetail(projectId).then(setData);
    }
  }, [projectId]);

  if (!projectId) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatLakhs = (val?: number) => {
    if (val === undefined) return '₹0.00 L';
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        
        {/* Modal Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-bold text-emerald-400">AUDIT LEDGER</span>
            <span>·</span>
            <span className="text-slate-300">Statutory Project Transparency Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Official Document Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold block">
                JanDrishti AI · Civic Oversight &amp; Public Works Ledger
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Project Transparency &amp; Social Audit Report
              </h2>
              <p className="text-slate-600 text-[11px]">
                Generated in compliance with Rural Development Social Audit Standards
              </p>
            </div>

            <div className="text-right font-mono text-[11px] text-slate-600">
              <span className="block font-bold text-slate-900">{data?.project.code}</span>
              <span>Date: {new Date().toISOString().split('T')[0]}</span>
              <span className="block text-amber-800 text-[10px] font-semibold">DEMO AUDIT RECORD</span>
            </div>
          </div>

          {/* Project Details Grid */}
          {data ? (
            <div className="space-y-5">
              
              {/* Particulars Section */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
                  1. Project Particulars &amp; Administrative Assignment
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Project Name:</span>
                    <strong className="text-slate-900 text-xs">{data.project.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Gram Panchayat / Block:</span>
                    <span>{data.project.panchayat_name}, Block {data.project.block_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">District / State:</span>
                    <span>{data.project.district_name}, {data.project.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Administrative Department:</span>
                    <span>{data.project.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Flagship Scheme:</span>
                    <span>{data.project.scheme}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contractor &amp; GSTIN:</span>
                    <span className="font-mono text-[11px]">{data.project.contractor_name} ({data.project.contractor_id})</span>
                  </div>
                </div>
              </div>

              {/* Financial Outlay & Voucher Disbursement Ledger */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
                  2. Financial Outlay &amp; Voucher Disbursement Ledger
                </h3>
                <table className="w-full text-left border border-slate-200 rounded">
                  <thead className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2">Financial Milestone Item</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                      <th className="p-2 text-right">% of Total</th>
                      <th className="p-2">Statutory Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-800">Approved Sanction Budget</td>
                      <td className="p-2 text-right font-bold">{formatLakhs(data.project.sanctioned_amount)}</td>
                      <td className="p-2 text-right">100.0%</td>
                      <td className="p-2 font-sans text-emerald-800">Appropriated</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-800">Funds Released to Drawing Officer</td>
                      <td className="p-2 text-right">{formatLakhs(data.project.released_amount)}</td>
                      <td className="p-2 text-right">{data.calculated.disbursed_percentage}%</td>
                      <td className="p-2 font-sans text-blue-800">Transferred via PFMS</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-800">Voucher Recorded Expenditure</td>
                      <td className="p-2 text-right font-bold text-emerald-700">{formatLakhs(data.project.recorded_expenditure)}</td>
                      <td className="p-2 text-right">{data.calculated.expenditure_percentage}%</td>
                      <td className="p-2 font-sans text-slate-700">Audit Verified</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2 font-sans">Remaining Treasury Balance</td>
                      <td className="p-2 text-right">{formatLakhs(data.calculated.remaining_funds)}</td>
                      <td className="p-2 text-right">{100 - data.calculated.expenditure_percentage}%</td>
                      <td className="p-2 font-sans text-slate-600">Pending Milestones</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Physical Milestone vs AI Vision Audit */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
                  3. Physical Verification &amp; AI Computer Vision Observations
                </h3>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 text-slate-700">
                  <div className="flex justify-between items-center text-xs">
                    <span>Department Claimed Physical Progress: <strong>{data.project.reported_progress_pct}%</strong></span>
                    <span>Current Status: <strong className="capitalize">{data.project.status}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Photographic inspections cross-checked against Public Works Department specifications. Recorded coordinates: {data.project.lat}°, {data.project.lng}°.
                  </div>
                </div>
              </div>

              {/* Citizen Complaints Record */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
                  4. Registered Citizen Grievances ({data.complaints.length})
                </h3>
                {data.complaints.length === 0 ? (
                  <p className="text-slate-500 italic p-2 bg-slate-50 rounded">No citizen complaints logged for this work.</p>
                ) : (
                  <div className="space-y-1.5">
                    {data.complaints.map(c => (
                      <div key={c.id} className="p-2 border border-slate-200 rounded flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="font-mono text-slate-900">{c.reference_id}</strong>
                          <span className="text-slate-500 ml-2">Category: {c.category}</span>
                        </div>
                        <span className="font-semibold text-slate-800">{c.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certification Sign-Off Block */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-[11px] text-slate-600">
                <div className="border-t border-slate-300 pt-2">
                  <p className="font-semibold text-slate-900">Gram Sabha Social Audit Committee</p>
                  <p className="text-slate-400 text-[10px]">Resident Representative Sign-Off</p>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <p className="font-semibold text-slate-900">Executive Engineer / Sub-Divisional Officer</p>
                  <p className="text-slate-400 text-[10px]">Public Works Department Certification</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">Loading audit report...</div>
          )}

        </div>

      </div>
    </div>
  );
};
