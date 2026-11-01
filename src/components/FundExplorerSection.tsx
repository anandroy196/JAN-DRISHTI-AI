import React, { useState, useEffect } from 'react';
import { District, Block, Panchayat, Project } from '../types';
import { fetchDistricts, fetchBlocks, fetchPanchayats, fetchProjects } from '../api';
import { 
  Building2, Layers, Search, Filter, ArrowUpRight, 
  ExternalLink, CheckCircle2, AlertCircle, FileText, Download 
} from 'lucide-react';

interface FundExplorerSectionProps {
  onSelectProject: (id: number) => void;
  onOpenReportModal: (projectId: number) => void;
}

export const FundExplorerSection: React.FC<FundExplorerSectionProps> = ({
  onSelectProject,
  onOpenReportModal
}) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [panchayats, setPanchayats] = useState<Panchayat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(undefined);
  const [selectedBlockId, setSelectedBlockId] = useState<number | undefined>(undefined);
  const [selectedPanchayatId, setSelectedPanchayatId] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDistricts();
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedDistrictId) {
      fetchBlocks(selectedDistrictId).then(setBlocks);
    } else {
      setBlocks([]);
    }
    setSelectedBlockId(undefined);
    setSelectedPanchayatId(undefined);
    loadProjects();
  }, [selectedDistrictId]);

  useEffect(() => {
    if (selectedBlockId) {
      fetchPanchayats(selectedBlockId).then(setPanchayats);
    } else {
      setPanchayats([]);
    }
    setSelectedPanchayatId(undefined);
    loadProjects();
  }, [selectedBlockId]);

  useEffect(() => {
    loadProjects();
  }, [selectedPanchayatId, statusFilter]);

  const loadDistricts = async () => {
    try {
      const data = await fetchDistricts();
      setDistricts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects({
        district_id: selectedDistrictId,
        block_id: selectedBlockId,
        panchayat_id: selectedPanchayatId,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(2)} L`;
  };

  const totalSanctioned = projects.reduce((acc, p) => acc + p.sanctioned_amount, 0);
  const totalReleased = projects.reduce((acc, p) => acc + p.released_amount, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.recorded_expenditure, 0);
  const totalRemaining = totalSanctioned - totalSpent;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Hierarchy Breadcrumb Header */}
      <div className="border-b border-slate-200 pb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Hierarchy</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">
            {selectedDistrictId ? districts.find(d => d.id === selectedDistrictId)?.name : 'All Districts'}
          </span>
          {selectedBlockId && (
            <>
              <span>/</span>
              <span className="text-slate-900 font-semibold">
                {blocks.find(b => b.id === selectedBlockId)?.name}
              </span>
            </>
          )}
          {selectedPanchayatId && (
            <>
              <span>/</span>
              <span className="text-emerald-700 font-semibold">
                {panchayats.find(p => p.id === selectedPanchayatId)?.name}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Government Fund Explorer
            </h1>
            <p className="text-xs text-slate-500">
              Granular fund traceability from state treasury down to village Gram Panchayat works.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
              Verified PFMS &amp; e-GramSwaraj Integrations
            </span>
          </div>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* District Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              District
            </label>
            <select
              value={selectedDistrictId || ''}
              onChange={(e) => setSelectedDistrictId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="">All Districts (Punjab)</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          {/* Block Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Development Block
            </label>
            <select
              disabled={!selectedDistrictId}
              value={selectedBlockId || ''}
              onChange={(e) => setSelectedBlockId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
            >
              <option value="">All Blocks</option>
              {blocks.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Panchayat Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Gram Panchayat
            </label>
            <select
              disabled={!selectedBlockId}
              value={selectedPanchayatId || ''}
              onChange={(e) => setSelectedPanchayatId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
            >
              <option value="">All Gram Panchayats</option>
              {panchayats.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Project Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed / Overdue</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search scheme, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

        </form>

        {/* Aggregate Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Filtered Projects:</span>
            <span className="font-mono font-bold text-slate-900">{projects.length} Records</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Sanctioned:</span>
            <span className="font-mono font-bold text-slate-900">{formatLakhs(totalSanctioned)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Disbursed:</span>
            <span className="font-mono font-bold text-emerald-700">{formatLakhs(totalSpent)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Remaining Balance:</span>
            <span className="font-mono font-bold text-slate-700">{formatLakhs(totalRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Project ID &amp; Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Department / Scheme</th>
                <th className="py-3 px-4 text-right">Sanctioned</th>
                <th className="py-3 px-4 text-right">Spent</th>
                <th className="py-3 px-4 text-right">Remaining</th>
                <th className="py-3 px-4 text-center">Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Loading financial records from persistent SQLite store...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No development project records match your selected criteria.
                  </td>
                </tr>
              ) : (
                projects.map((p) => {
                  const remaining = p.sanctioned_amount - p.recorded_expenditure;
                  const isDelayed = p.status === 'delayed';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-mono font-semibold text-slate-900 block text-[11px]">
                          {p.code}
                        </span>
                        <span className="text-slate-800 font-medium line-clamp-2 text-xs">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block pt-0.5">
                          Contractor: {p.contractor_name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">
                          {p.panchayat_name || 'GP'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {p.block_name}, {p.district_name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="text-slate-900 font-medium block truncate">
                          {p.department}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {p.scheme}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                        {formatLakhs(p.sanctioned_amount)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                        {formatLakhs(p.recorded_expenditure)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                        {formatLakhs(remaining)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-xs font-semibold text-slate-800 block">
                          {p.reported_progress_pct}%
                        </span>
                        <div className="w-16 bg-slate-200 rounded-full h-1 mx-auto mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${isDelayed ? 'bg-amber-500' : 'bg-emerald-600'}`}
                            style={{ width: `${Math.min(100, p.reported_progress_pct)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border capitalize ${
                          p.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : p.status === 'delayed'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectProject(p.id)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => onOpenReportModal(p.id)}
                            title="Export Transparency Audit"
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
