import React, { useState } from 'react';
import { Project, District, Block, Panchayat } from '../types';
import { createProject } from '../api';
import { X, Building2, Plus, RefreshCw } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: District[];
  onProjectCreated: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  districts,
  onProjectCreated
}) => {
  const [name, setName] = useState('');
  const [districtId, setDistrictId] = useState<number>(1);
  const [department, setDepartment] = useState('Public Works Department (Rural Roads)');
  const [scheme, setScheme] = useState('Pradhan Mantri Gram Sadak Yojana (PMGSY-III)');
  const [contractorName, setContractorName] = useState('');
  const [contractorId, setContractorId] = useState('');
  const [sanctionedAmount, setSanctionedAmount] = useState<number>(5000000);
  const [expectedCompletion, setExpectedCompletion] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject({
        name,
        district_id: districtId,
        department,
        scheme,
        contractor_name: contractorName || 'State Empanelled Contractor',
        contractor_id: contractorId || 'GSTIN-PENDING',
        sanctioned_amount: Number(sanctionedAmount),
        released_amount: Number(sanctionedAmount) * 0.7,
        paid_to_contractor: 0,
        recorded_expenditure: 0,
        expected_completion: expectedCompletion,
        description: description || 'New infrastructure work recorded on JanDrishti.',
        status: 'planned',
        reported_progress_pct: 0
      });
      onProjectCreated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Register New Sanctioned Development Work
            </h2>
            <p className="text-xs text-slate-500">
              Official administrative grant entry synchronized with e-GramSwaraj.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Construction of Concrete Drain & Pavement..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sanctioned Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="100000"
                step="50000"
                value={sanctionedAmount}
                onChange={(e) => setSanctionedAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Scheme / Programme
              </label>
              <input
                type="text"
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contractor Name
              </label>
              <input
                type="text"
                placeholder="Contractor or Direct GP"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contractor GSTIN / Tender ID
              </label>
              <input
                type="text"
                placeholder="03AAACS1289P1Z5"
                value={contractorId}
                onChange={(e) => setContractorId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Expected Completion Date
            </label>
            <input
              type="date"
              value={expectedCompletion}
              onChange={(e) => setExpectedCompletion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Scope of Work &amp; Specifications
            </label>
            <textarea
              rows={3}
              placeholder="Technical specifications, culvert count, pipe diameter, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Save &amp; Sanction Work</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
