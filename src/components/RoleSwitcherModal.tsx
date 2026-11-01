import React from 'react';
import { UserRole, UserProfile } from '../types';
import { X, UserCheck, Shield, Building2, ShieldCheck, Check } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectRole
}) => {
  if (!isOpen) return null;

  const roleDefinitions: Array<{
    role: UserRole;
    title: string;
    designation: string;
    organization: string;
    description: string;
    badge: string;
  }> = [
    {
      role: 'citizen',
      title: 'Citizen / Gram Sabha Resident',
      designation: 'Harpreet Singh (Resident Activist)',
      organization: 'Gram Sabha Bhaini Sahib, Ludhiana',
      description: 'Search public fund ledger, view project photographs, log geo-tagged grievances, rate resolved works.',
      badge: 'Public Citizen Access'
    },
    {
      role: 'official',
      title: 'Government Official (Executive Engineer)',
      designation: 'Er. Gurdev Singh (Executive Engineer)',
      organization: 'Public Works Department (Rural Roads Division)',
      description: 'Record milestone physical progress, submit contractor expenditure vouchers, review assigned grievances.',
      badge: 'Department Execution'
    },
    {
      role: 'admin',
      title: 'District / Block Administrator',
      designation: 'Ms. Simranjeet Kaur, IAS (ADC Development)',
      organization: 'District Administration Ludhiana',
      description: 'Review inter-block expenditure, monitor delay registries, summon contractors, escalate anomaly alerts.',
      badge: 'District Governance'
    },
    {
      role: 'superadmin',
      title: 'State Mission Director & Tech Lead',
      designation: 'Dr. Rajiv Menon (State Mission Director)',
      organization: 'Department of Rural Development & Panchayati Raj',
      description: 'System audit logs, cryptographic transaction verification, integration endpoints, role provisioning.',
      badge: 'State Oversight'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-5 sm:p-6 space-y-4 max-h-[92dvh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Select Operating Persona &amp; Governance Role
            </h2>
            <p className="text-xs text-slate-500">
              Demonstrates role-based access control (RBAC) enforced by backend API permissions.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {roleDefinitions.map((item) => {
            const isSelected = currentUser.role === item.role;
            return (
              <div
                key={item.role}
                onClick={() => {
                  onSelectRole(item.role);
                  onClose();
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-800">
                    {item.designation} · {item.organization}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="pt-1">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-[11px] text-slate-400 text-center">
          In production, authentication utilizes OpenID Connect / e-Pramaan government SSO tokens.
        </div>

      </div>
    </div>
  );
};
