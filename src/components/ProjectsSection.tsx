import React, { useState } from 'react';
import { Project, UserRole } from '../types';
import { Search, Filter, MapPin, Building2, ExternalLink, Download, Plus, ArrowUpRight } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (id: number) => void;
  onOpenReportModal: (id: number) => void;
  currentUserRole: UserRole;
  onOpenCreateProjectModal: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  onOpenReportModal,
  currentUserRole,
  onOpenCreateProjectModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = Array.from(new Set(projects.map((p) => p.department)));

  const filtered = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contractor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.panchayat_name && p.panchayat_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesDept = selectedDepartment === 'all' || p.department === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Development Projects Directory
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive audit registry of all sanctioned rural development works.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(currentUserRole === 'official' || currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
            <button
              onClick={onOpenCreateProjectModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sanctioned Work</span>
            </button>
          )}
          <span className="text-xs text-slate-500 font-mono">
            {filtered.length} of {projects.length} Works
          </span>
        </div>
      </div>

      {/* Filter Controls (Segmented Tabs & Search) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto no-scrollbar">
          {(['all', 'ongoing', 'completed', 'delayed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors capitalize ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>

        {/* Department Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 sm:py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by code, contractor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 sm:top-2" />
          </div>
        </div>

      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const isDelayed = p.status === 'delayed';

          return (
            <div
              key={p.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-500 text-[11px]">
                    {p.code}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border capitalize ${
                    p.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isDelayed
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectProject(p.id)}
                  className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer"
                >
                  {p.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{p.panchayat_name || 'GP'}, {p.district_name || 'PB'}</span>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1">
                  Dept: {p.department}
                </div>
              </div>

              {/* Financial & Progress Breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sanctioned:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatLakhs(p.sanctioned_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recorded Spent:</span>
                  <span className="font-mono font-semibold text-emerald-700">{formatLakhs(p.recorded_expenditure)}</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-600">
                    <span>Physical Milestone</span>
                    <span>{p.reported_progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isDelayed ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.min(100, p.reported_progress_pct)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectProject(p.id)}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-0.5"
                  >
                    <span>View Audit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenReportModal(p.id)}
                    title="Print Transparency Ledger"
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
