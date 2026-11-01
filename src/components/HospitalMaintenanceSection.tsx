import React, { useState, useEffect } from 'react';
import { Hospital, HospitalMaintenanceReport } from '../types';
import { fetchHospitals, fetchHospitalDetail, submitHospitalReport } from '../api';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Building2,
  Droplets,
  Zap,
  Activity,
  Flame,
  FileSpreadsheet,
  Trash2,
  X
} from 'lucide-react';

interface HospitalMaintenanceSectionProps {
  currentUserRole?: string;
}

export const HospitalMaintenanceSection: React.FC<HospitalMaintenanceSectionProps> = ({ currentUserRole }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [maintenanceReports, setMaintenanceReports] = useState<HospitalMaintenanceReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form State for Hospital Weekly Inspection
  const [formData, setFormData] = useState({
    hospital_id: 1,
    reporting_week: `Week 43, Oct 2026`,
    week_start_date: '2026-10-25',
    week_end_date: '2026-10-31',
    building_cleanliness: 'Daily three-shift terminal cleaning compliant; OPD & Emergency sanitized',
    safe_water: 'Water supply uninterrupted, chlorination test certified (0.4 ppm)',
    electricity_backup_power: '125 kVA Auto-generator tested, 250L diesel reserve confirmed operational',
    toilets_sanitation: 'All OPD & ward washrooms operational with disinfectant logs signed',
    biomedical_waste_segregation: 'Barcoded color-coded bags (Yellow, Red, Blue, White puncture-proof) compliant; CBWTF collection on schedule',
    fire_safety_exits: 'Emergency ramp clear, fire hydrants pressurized at 7 bar',
    essential_equipment_status: 'ECG, 2 Infant Warmers, 10 Oxygen Concentrators operational; 1 Dental chair motor serviced',
    repairs_completed: 'Serviced backup generator battery; replaced shattered ward window pane',
    repairs_pending: 'Minor plaster seepage in maternity ward corridor',
    maintenance_expenditure: 14200,
    inspection_date: '2026-10-31',
    reporting_officer: 'Dr. Paramjit Kaur, Senior Medical Officer (SMO)',
    verification_status: 'Verified',
    notes: 'Meets National Quality Assurance Standards (NQAS) maintenance benchmark.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHospitals();
      setHospitals(data);
      if (data.length > 0) {
        handleSelectHospital(data[0]);
      }
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHospital = async (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setFormData(prev => ({ ...prev, hospital_id: hospital.id }));
    try {
      const detail = await fetchHospitalDetail(hospital.id);
      setMaintenanceReports(detail.maintenance_reports || []);
    } catch (err) {
      console.error('Failed to load hospital details:', err);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospital) return;
    try {
      setIsSubmitting(true);
      await submitHospitalReport(selectedHospital.id, formData);
      setActionMessage('Weekly Healthcare Facility Audit successfully recorded & certified.');
      setIsSubmitModalOpen(false);
      handleSelectHospital(selectedHospital);
      setTimeout(() => setActionMessage(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit hospital report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.facility_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.district_name && h.district_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Minor Maintenance Required':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Major Maintenance Required':
      case 'Critical Facility Issue Under Review':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Weekly Update Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Notice */}
      <div className="bg-sky-950 text-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-sky-800 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5" />
              Public Health Infrastructure Oversight
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hospital & Healthcare Facility Maintenance Audit
            </h1>
            <p className="text-sm text-sky-100/90 max-w-3xl">
              Public tracking of PHC/CHC hygiene standards, continuous electricity backup, biomedical waste segregation compliance, and essential emergency equipment readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Submit Facility Inspection
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

      {/* Grid: Facility Directory Left + Detailed Inspection View Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Hospital Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search PHC, CHC, or hospital name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {['All', 'Good', 'Minor Maintenance Required', 'Weekly Update Overdue'].map(st => (
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

          {/* Hospital Cards List */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
                Loading healthcare facilities...
              </div>
            ) : filteredHospitals.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
                No healthcare facilities matching criteria.
              </div>
            ) : (
              filteredHospitals.map(hospital => {
                const isSelected = selectedHospital?.id === hospital.id;
                return (
                  <div
                    key={hospital.id}
                    onClick={() => handleSelectHospital(hospital)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {hospital.code}
                          </span>
                          <span className="text-xs font-semibold text-sky-800">{hospital.facility_type}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mt-1 leading-snug">
                          {hospital.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {hospital.panchayat_name}, {hospital.district_name}
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border whitespace-nowrap ${getStatusBadge(hospital.status)}`}>
                        {hospital.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inspected: {hospital.last_inspection_date}</span>
                      </div>
                      <span className="text-sky-700 font-medium">View Maintenance Records →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Hospital Details & Inspection Reports */}
        <div className="lg:col-span-7 space-y-6">
          {selectedHospital ? (
            <div className="space-y-6">
              
              {/* Header Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedHospital.code}
                      </span>
                      <span className="text-xs font-medium text-slate-600">{selectedHospital.facility_type}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {selectedHospital.name}
                    </h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {selectedHospital.address} • {selectedHospital.district_name}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-md border ${getStatusBadge(selectedHospital.status)}`}>
                      {selectedHospital.status}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Authority: {selectedHospital.managing_authority}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Facility Level</span>
                    <span className="font-semibold text-slate-900">{selectedHospital.facility_type.split(' ')[0]}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Last Audit</span>
                    <span className="font-semibold text-slate-900">{selectedHospital.last_inspection_date}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Audits on Record</span>
                    <span className="font-semibold text-slate-900">{maintenanceReports.length} Inspection Cycles</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Upkeep Spend</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{maintenanceReports.reduce((acc, curr) => acc + (curr.maintenance_expenditure || 0), 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Maintenance Reports List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-sky-700" />
                    Facility Maintenance & Biomedical Verification Log
                  </h3>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Weekly Inspection
                  </button>
                </div>

                {maintenanceReports.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                    No weekly maintenance inspections recorded yet for this facility.
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
                              Cost: ₹{(report.maintenance_expenditure || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {report.verification_status}
                            </span>
                          </div>
                        </div>

                        {/* Healthcare Specific Checks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Building2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Hygiene & Cleanliness</span>
                              <span className="text-slate-600">{report.building_cleanliness}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Backup Generator & Power</span>
                              <span className="text-slate-600">{report.electricity_backup_power}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Trash2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Biomedical Waste Segregation</span>
                              <span className="text-slate-600">{report.biomedical_waste_segregation}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Activity className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Essential Medical Equipment</span>
                              <span className="text-slate-600">{report.essential_equipment_status}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Droplets className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Safe Water Supply & Chlorination</span>
                              <span className="text-slate-600">{report.safe_water}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                            <Flame className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900 block">Emergency Exits & Fire Ramps</span>
                              <span className="text-slate-600">{report.fire_safety_exits}</span>
                            </div>
                          </div>
                        </div>

                        {/* Completed & Pending Repairs */}
                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-800">Repairs Carried Out:</span>
                            <span className="text-slate-700">{report.repairs_completed || 'Scheduled servicing completed.'}</span>
                          </div>
                          {report.repairs_pending && (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-800">Pending Works:</span>
                              <span className="text-slate-700">{report.repairs_pending}</span>
                            </div>
                          )}
                          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200">
                            <span>Medical Officer: {report.reporting_officer}</span>
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
              Select a healthcare facility from the directory on the left.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Submit Weekly Hospital Audit */}
      {isSubmitModalOpen && selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Submit Healthcare Facility Weekly Audit
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedHospital.name} ({selectedHospital.code})
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Week Start</label>
                  <input
                    type="date"
                    required
                    value={formData.week_start_date}
                    onChange={e => setFormData({ ...formData, week_start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Week End</label>
                  <input
                    type="date"
                    required
                    value={formData.week_end_date}
                    onChange={e => setFormData({ ...formData, week_end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Building Cleanliness & Hygiene</label>
                  <input
                    type="text"
                    required
                    value={formData.building_cleanliness}
                    onChange={e => setFormData({ ...formData, building_cleanliness: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Electricity & Backup Generator</label>
                  <input
                    type="text"
                    required
                    value={formData.electricity_backup_power}
                    onChange={e => setFormData({ ...formData, electricity_backup_power: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Biomedical Waste Segregation</label>
                  <input
                    type="text"
                    required
                    value={formData.biomedical_waste_segregation}
                    onChange={e => setFormData({ ...formData, biomedical_waste_segregation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Essential Equipment Readiness</label>
                  <input
                    type="text"
                    required
                    value={formData.essential_equipment_status}
                    onChange={e => setFormData({ ...formData, essential_equipment_status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Safe Water Supply</label>
                  <input
                    type="text"
                    required
                    value={formData.safe_water}
                    onChange={e => setFormData({ ...formData, safe_water: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Emergency Exits & Fire Hydrants</label>
                  <input
                    type="text"
                    required
                    value={formData.fire_safety_exits}
                    onChange={e => setFormData({ ...formData, fire_safety_exits: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Weekly Spend (₹)</label>
                  <input
                    type="number"
                    value={formData.maintenance_expenditure}
                    onChange={e => setFormData({ ...formData, maintenance_expenditure: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Reporting Medical Officer</label>
                  <input
                    type="text"
                    required
                    value={formData.reporting_officer}
                    onChange={e => setFormData({ ...formData, reporting_officer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Inspection Date</label>
                  <input
                    type="date"
                    required
                    value={formData.inspection_date}
                    onChange={e => setFormData({ ...formData, inspection_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Clinical Notes & Compliance Audit Details</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
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
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording Audit...' : 'Publish Official Inspection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
