import React, { useState, useEffect } from 'react';
import { School, SchoolMaintenanceReport } from '../types';
import { fetchSchools, fetchSchoolDetail, submitSchoolReport } from '../api';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Building,
  ShieldCheck,
  Droplets,
  Zap,
  Users,
  Flame,
  FileSpreadsheet,
  X,
  ExternalLink
} from 'lucide-react';

interface SchoolMaintenanceSectionProps {
  currentUserRole?: string;
}

export const SchoolMaintenanceSection: React.FC<SchoolMaintenanceSectionProps> = ({ currentUserRole }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [maintenanceReports, setMaintenanceReports] = useState<SchoolMaintenanceReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form State for Weekly Audit Submission
  const [formData, setFormData] = useState({
    school_id: 1,
    reporting_week: `Week 43, Oct 2026`,
    week_start_date: '2026-10-25',
    week_end_date: '2026-10-31',
    building_condition: 'Good structural safety',
    classrooms_condition: '8/8 Classrooms clean and ventilated',
    toilets_sanitation: 'Functional separate toilets for boys and girls with continuous running water',
    drinking_water: 'Tested safe RO water dispenser operational (TDS: 120)',
    electricity_power: 'Wiring inspected, LED lights and ceiling fans operational',
    desks_furniture: 'Sufficient dual-desks in all classrooms',
    fire_safety: '2 Fire extinguishers inspected and valid until Dec 2026',
    repairs_completed: 'Repaired broken boundary wall gate latch',
    repairs_pending: 'Playground ground levelling requested',
    maintenance_expenditure: 8500,
    inspection_date: '2026-10-31',
    reporting_officer: 'Gurinder Singh, Block Education Officer',
    verification_status: 'Verified',
    notes: 'Weekly inspection passed all state education safety standards.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSchools();
      setSchools(data);
      if (data.length > 0) {
        handleSelectSchool(data[0]);
      }
    } catch (err) {
      console.error('Failed to load schools:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSchool = async (school: School) => {
    setSelectedSchool(school);
    setFormData(prev => ({ ...prev, school_id: school.id }));
    try {
      const detail = await fetchSchoolDetail(school.id);
      setMaintenanceReports(detail.maintenance_reports || []);
    } catch (err) {
      console.error('Failed to load school details:', err);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;
    try {
      setIsSubmitting(true);
      await submitSchoolReport(selectedSchool.id, formData);
      setActionMessage('Weekly School Maintenance Audit successfully recorded & published.');
      setIsSubmitModalOpen(false);
      // Reload detail
      handleSelectSchool(selectedSchool);
      setTimeout(() => setActionMessage(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit maintenance audit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.district_name && s.district_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.panchayat_name && s.panchayat_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Minor Maintenance Required':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Major Maintenance Required':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Update Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-800 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              Public Education Oversight
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              School Maintenance & Weekly Inspection Portal
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-3xl">
              Mandatory weekly audit cycles tracking sanitation, safe drinking water, structural classroom integrity, and electrical safety across rural and urban government schools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Submit Weekly Audit
            </button>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: School Selector Left + Detailed Inspection View Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: School Directory & Search */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search school name, block, or panchayat..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {['All', 'Good', 'Minor Maintenance Required', 'Update Overdue'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* School List */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
                Loading educational institutions...
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
                No schools matching criteria.
              </div>
            ) : (
              filteredSchools.map(school => {
                const isSelected = selectedSchool?.id === school.id;
                return (
                  <div
                    key={school.id}
                    onClick={() => handleSelectSchool(school)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {school.code}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">{school.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mt-1 leading-snug">
                          {school.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {school.panchayat_name}, {school.block_name}, {school.district_name}
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border whitespace-nowrap ${getStatusBadge(school.status)}`}>
                        {school.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Last Audit: {school.last_inspection_date}</span>
                      </div>
                      <span className="text-emerald-700 font-medium">View Audit Trail →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected School Detail & Weekly Maintenance Logs */}
        <div className="lg:col-span-7 space-y-6">
          {selectedSchool ? (
            <div className="space-y-6">
              
              {/* Header Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedSchool.code}
                      </span>
                      <span className="text-xs font-medium text-slate-600">{selectedSchool.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {selectedSchool.name}
                    </h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {selectedSchool.address} • {selectedSchool.panchayat_name}, {selectedSchool.district_name}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-md border ${getStatusBadge(selectedSchool.status)}`}>
                      {selectedSchool.status}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Authority: {selectedSchool.managing_authority}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Contact Officer</span>
                    <span className="font-semibold text-slate-900">{selectedSchool.contact_person}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Last Audit Date</span>
                    <span className="font-semibold text-slate-900">{selectedSchool.last_inspection_date}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Weekly Logs On Record</span>
                    <span className="font-semibold text-slate-900">{maintenanceReports.length} Inspections</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Total Repair Budget</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{maintenanceReports.reduce((acc, curr) => acc + (curr.maintenance_expenditure || 0), 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Audit Reports Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                    Weekly Audit & Maintenance Inspection Trail
                  </h3>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Record New Audit
                  </button>
                </div>

                {maintenanceReports.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                    No weekly maintenance inspections recorded yet for this institution.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {maintenanceReports.map((report) => (
                      <div key={report.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <span className="font-bold text-slate-900 text-base">{report.reporting_week}</span>
                            <span className="text-xs text-slate-500 ml-2">({report.week_start_date} to {report.week_end_date})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              Exp: ₹{(report.maintenance_expenditure || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {report.verification_status}
                            </span>
                          </div>
                        </div>

                        {/* Checklist Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Droplets className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Toilets & Sanitation</span>
                              <span className="text-slate-600">{report.toilets_sanitation}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Droplets className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Safe Drinking Water</span>
                              <span className="text-slate-600">{report.drinking_water}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Electricity & Wiring Safety</span>
                              <span className="text-slate-600">{report.electricity_power}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Building className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Structural & Building Safety</span>
                              <span className="text-slate-600">{report.building_condition}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Users className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Classroom Desks & Furniture</span>
                              <span className="text-slate-600">{report.desks_furniture}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Fire Extinguisher & Exits</span>
                              <span className="text-slate-600">{report.fire_safety}</span>
                            </div>
                          </div>
                        </div>

                        {/* Completed vs Pending Repairs */}
                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-800">Completed This Week:</span>
                            <span className="text-slate-700">{report.repairs_completed || 'Regular upkeep completed.'}</span>
                          </div>
                          {report.repairs_pending && (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-800">Pending Escalations:</span>
                              <span className="text-slate-700">{report.repairs_pending}</span>
                            </div>
                          )}
                          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200">
                            <span>Inspecting Officer: {report.reporting_officer}</span>
                            <span>Audit Date: {report.inspection_date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
              Select a school from the left to view weekly audits.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Submit Weekly Audit */}
      {isSubmitModalOpen && selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Submit Weekly School Maintenance Audit
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedSchool.name} ({selectedSchool.code})
                </p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Reporting Cycle</label>
                  <input
                    type="text"
                    required
                    value={formData.reporting_week}
                    onChange={e => setFormData({ ...formData, reporting_week: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Week Start</label>
                  <input
                    type="date"
                    required
                    value={formData.week_start_date}
                    onChange={e => setFormData({ ...formData, week_start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Week End</label>
                  <input
                    type="date"
                    required
                    value={formData.week_end_date}
                    onChange={e => setFormData({ ...formData, week_end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Toilets & Sanitation Status</label>
                  <input
                    type="text"
                    required
                    value={formData.toilets_sanitation}
                    onChange={e => setFormData({ ...formData, toilets_sanitation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Safe Drinking Water Facility</label>
                  <input
                    type="text"
                    required
                    value={formData.drinking_water}
                    onChange={e => setFormData({ ...formData, drinking_water: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Electricity & Power Wiring</label>
                  <input
                    type="text"
                    required
                    value={formData.electricity_power}
                    onChange={e => setFormData({ ...formData, electricity_power: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Classroom Desks & Seating</label>
                  <input
                    type="text"
                    required
                    value={formData.desks_furniture}
                    onChange={e => setFormData({ ...formData, desks_furniture: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Building & Roof Integrity</label>
                  <input
                    type="text"
                    required
                    value={formData.building_condition}
                    onChange={e => setFormData({ ...formData, building_condition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Fire Extinguisher & Safety</label>
                  <input
                    type="text"
                    required
                    value={formData.fire_safety}
                    onChange={e => setFormData({ ...formData, fire_safety: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Completed Repairs</label>
                  <input
                    type="text"
                    value={formData.repairs_completed}
                    onChange={e => setFormData({ ...formData, repairs_completed: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Pending Works / Escalation</label>
                  <input
                    type="text"
                    value={formData.repairs_pending}
                    onChange={e => setFormData({ ...formData, repairs_pending: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Expenditure (₹)</label>
                  <input
                    type="number"
                    value={formData.maintenance_expenditure}
                    onChange={e => setFormData({ ...formData, maintenance_expenditure: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Auditing Officer</label>
                  <input
                    type="text"
                    required
                    value={formData.reporting_officer}
                    onChange={e => setFormData({ ...formData, reporting_officer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Inspection Date</label>
                  <input
                    type="date"
                    required
                    value={formData.inspection_date}
                    onChange={e => setFormData({ ...formData, inspection_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Official Notes & Recommendations</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording Audit...' : 'Publish Official Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
