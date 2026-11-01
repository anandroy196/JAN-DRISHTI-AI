import React, { useState } from 'react';
import { 
  X, CheckCircle2, ChevronRight, ChevronLeft, Building2, 
  Coins, FileText, Camera, ScanLine, AlertCircle, UserCheck, 
  ArrowRight, Download, RefreshCw 
} from 'lucide-react';

interface HackathonWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  onOpenReportModal: (projectId: number) => void;
}

export const HackathonWalkthroughModal: React.FC<HackathonWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onOpenReportModal
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [demoComplaintStatus, setDemoComplaintStatus] = useState<'Received' | 'Under Review' | 'In Progress' | 'Resolved'>('Under Review');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiResultGenerated, setAiResultGenerated] = useState(false);

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Sanction Approval', category: 'Public Finance' },
    { number: 2, title: 'Administrative Flow', category: 'Hierarchy' },
    { number: 3, title: 'Contractor Profile', category: 'Procurement' },
    { number: 4, title: 'Site Photo & Voucher', category: 'Field Data' },
    { number: 5, title: 'AI Vision Audit', category: 'Discrepancy Check' },
    { number: 6, title: 'Citizen Grievance', category: 'Community Voice' },
    { number: 7, title: 'Admin Dispatch', category: 'Ticket Routing' },
    { number: 8, title: 'Official Review', category: 'Workflow Action' },
    { number: 9, title: 'Citizen Tracking', category: 'Public Timeline' },
    { number: 10, title: 'Transparency Audit', category: 'Export Ledger' },
  ];

  const handleSimulateAI = () => {
    setIsProcessingAI(true);
    setTimeout(() => {
      setIsProcessingAI(false);
      setAiResultGenerated(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-mono font-bold text-white">
              {currentStep}/10
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                National Hackathon End-to-End Walkthrough
              </h2>
              <p className="text-xs text-slate-400">
                10-Step Guided Demonstration of JanDrishti AI Core Capabilities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max text-xs">
            {steps.map((s) => (
              <button
                key={s.number}
                onClick={() => setCurrentStep(s.number)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  currentStep === s.number
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : currentStep > s.number
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s.number}. {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <Coins className="w-4 h-4 text-emerald-600" />
                Step 1: Public Development Fund Sanction Approval
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Central &amp; State Share Allocation for Rural Infrastructure
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Under the Pradhan Mantri Gram Sadak Yojana (PMGSY-III) Scheme, a development fund of 
                <strong className="text-slate-900"> ₹85,00,000 (Rs 85.0 Lakh)</strong> is sanctioned with a 60:40 central to state funding ratio.
              </p>
              
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Sanction Code:</span>
                    <span className="font-mono font-semibold text-slate-900">PMGSY/PB/2024/8841</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sanctioned Amount:</span>
                    <span className="font-mono font-semibold text-emerald-700 text-sm">₹85,00,000</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Central Share (60%):</span>
                    <span className="font-mono font-medium text-slate-800">₹51,00,000</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">State Share (40%):</span>
                    <span className="font-mono font-medium text-slate-800">₹34,00,000</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span>Authorized Public Source: Public Financial Management System (PFMS)</span>
                  <span className="text-amber-800 font-medium">DEMO DATA — NOT OFFICIAL RECORDS</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-blue-600" />
                Step 2: Administrative Hierarchy Drilldown
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                District → Block → Gram Panchayat Traceability
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Funds flow through transparent statutory bank accounts directly to the project level without intermediary leakages.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 py-3">
                <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-center w-full">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">District</span>
                  <p className="font-semibold text-slate-900 text-sm">Ludhiana (PB)</p>
                  <span className="text-xs text-slate-500 font-mono">₹4.25 Cr Budget</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
                <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-center w-full">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Block</span>
                  <p className="font-semibold text-slate-900 text-sm">Ludhiana-1</p>
                  <span className="text-xs text-slate-500 font-mono">18 Gram Panchayats</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
                <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-center w-full">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Gram Panchayat</span>
                  <p className="font-semibold text-slate-900 text-sm">Sahnewal Kalan</p>
                  <span className="text-xs text-slate-500 font-mono">Pop: 4,200</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-purple-600" />
                Step 3: Project Allocation &amp; Contractor Profile
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Singla Infra &amp; Engineering Pvt Ltd — All-Weather Bitumen Road
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <span className="font-semibold text-slate-900 block text-sm">Project Particulars</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project Code:</span>
                    <span className="font-mono font-medium text-slate-900">JD-PRJ-2025-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-900">Public Works Department (Rural)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sanctioned Road Length:</span>
                    <span className="font-medium text-slate-900">3.80 km (Bitumen Asphalt)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sanctioned Date:</span>
                    <span className="font-mono text-slate-700">15 Nov 2024</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <span className="font-semibold text-slate-900 block text-sm">Contractor Ledger</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contractor Name:</span>
                    <span className="font-medium text-slate-900">Singla Infra &amp; Engg Pvt Ltd</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GSTIN Identifier:</span>
                    <span className="font-mono text-slate-900">03AAACS1289P1Z5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Released to Date:</span>
                    <span className="font-mono font-semibold text-slate-900">₹72,00,000 (84.7%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Disbursed Expenditure:</span>
                    <span className="font-mono font-semibold text-emerald-700">₹68,00,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
                <Camera className="w-4 h-4 text-amber-600" />
                Step 4: Photographic Evidence &amp; Financial Milestone Voucher
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Administrative Claim vs Field Site Inspection
              </h3>
              <p className="text-sm text-slate-600">
                Department milestone claim #3 was filed stating <strong className="text-slate-900">85% Physical Completion</strong> with a request for final payment of ₹13,00,000.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                  <div className="p-2 bg-slate-200/80 text-[11px] font-semibold text-slate-700 flex justify-between">
                    <span>Baseline Site Photo (Nov 2024)</span>
                    <span className="font-mono">Start 0%</span>
                  </div>
                  <div className="h-40 bg-gradient-to-tr from-amber-900/20 to-slate-200 flex items-center justify-center p-4 text-center">
                    <div className="space-y-1">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-600 font-medium">Unpaved dirt track &amp; initial earthwork</p>
                      <span className="text-[10px] text-slate-400 font-mono">Geo: 30.8425° N, 75.9862° E</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                  <div className="p-2 bg-slate-200/80 text-[11px] font-semibold text-slate-700 flex justify-between">
                    <span>Milestone 3 Photo (Oct 2026)</span>
                    <span className="font-mono text-emerald-800">Claim: 85%</span>
                  </div>
                  <div className="h-40 bg-gradient-to-tr from-slate-700/30 to-slate-300 flex items-center justify-center p-4 text-center">
                    <div className="space-y-1">
                      <ScanLine className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="text-xs text-slate-800 font-medium">Sub-base aggregate with incomplete top asphalt wear</p>
                      <span className="text-[10px] text-emerald-700 font-mono">Voucher Ref: PFMS-V7718</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <ScanLine className="w-4 h-4 text-emerald-600" />
                Step 5: AI Computer Vision Progress Audit
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Variance Detected Between Reported Milestone &amp; Physical Evidence
              </h3>

              {!aiResultGenerated ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
                  <p className="text-xs text-slate-600">
                    Run the automated Computer Vision audit to cross-examine satellite and field imagery against the contractor's milestone voucher.
                  </p>
                  <button
                    onClick={handleSimulateAI}
                    disabled={isProcessingAI}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    {isProcessingAI ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Analyzing Structural Edge &amp; Bitumen Density...</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4 text-emerald-400" />
                        <span>Execute AI Vision Inspection</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Audit Alert: -21% Progress Discrepancy Flagged</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-red-100 text-red-800 rounded">
                      Confidence: 91%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded border border-red-100">
                      <span className="text-slate-500 block">Reported:</span>
                      <span className="font-mono font-bold text-slate-800">85% Complete</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-red-100">
                      <span className="text-slate-500 block">AI Verified:</span>
                      <span className="font-mono font-bold text-red-700">64% Complete</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-red-100">
                      <span className="text-slate-500 block">Variance:</span>
                      <span className="font-mono font-bold text-red-700">-21% Lag</span>
                    </div>
                  </div>

                  <p className="text-xs text-red-900 leading-relaxed">
                    <strong>Findings:</strong> Top bitumen wear course is missing on 36% of the 3.8 km corridor. Financial voucher of ₹13,00,000 recommended to be held until physical on-site measurement is completed.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Step 6: Citizen Grievance Lodged with Geotag &amp; Photo
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Citizen Harpreet Singh Logs Public Road Hazard
              </h3>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">JD-2026-8812</span>
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                      High Priority
                    </span>
                  </div>
                  <span className="text-slate-500">28 Oct 2026, 09:15 AM</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block">Citizen Complainant:</span>
                    <span className="font-medium text-slate-900">Harpreet Singh (Resident)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <span className="font-medium text-slate-900">Damaged Roads / Potholes</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Linked Project:</span>
                    <span className="font-mono text-slate-800">JD-PRJ-2025-001 (Sahnewal)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location:</span>
                    <span className="font-mono text-slate-800">30.8429° N, 75.9868° E</span>
                  </div>
                </div>

                <p className="text-slate-700 italic bg-white p-2.5 rounded border border-slate-200">
                  "Severe potholes have opened up near the culvert section of Sahnewal canal road after recent rains. Two two-wheelers skidded yesterday. Paving was marked 85% done but this section is broken."
                </p>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Step 7: Automated Ticket Routing to Administrator Console
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                District Administrator Dashboard (ADC Development Ludhiana)
              </h3>
              <p className="text-sm text-slate-600">
                The grievance is automatically cross-referenced with the public project database and dispatched to the Executive Engineer PWD Rural for mandatory 72-hour redressal.
              </p>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between text-blue-900 font-semibold">
                  <span>Routing Rule #PB-PWD-01 Triggered</span>
                  <span className="font-mono">Latency: 0.12s</span>
                </div>
                <p className="text-blue-800">
                  Target Officer: <strong>Er. Gurdev Singh (Executive Engineer, PWD Rural Works)</strong>. Statutory notice drafted with project voucher hold recommendation.
                </p>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Step 8: Official Action &amp; Status Transition
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Officer Progresses Complaint from 'Under Review' to 'Resolved'
              </h3>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Select Official Action to Demo:</span>
                  <div className="flex gap-2">
                    {(['Under Review', 'In Progress', 'Resolved'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setDemoComplaintStatus(st)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          demoComplaintStatus === st
                            ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Officer Remark:</span>
                    <span className="text-slate-500 font-mono text-[11px]">Recorded with Cryptographic Timestamp</span>
                  </div>
                  <p className="text-slate-600">
                    {demoComplaintStatus === 'Under Review' && 'Site engineer deputed for joint physical inspection with contractor representatives.'}
                    {demoComplaintStatus === 'In Progress' && 'Excavator and cold-mix bitumen patching team deployed. Culvert drainage clearing active.'}
                    {demoComplaintStatus === 'Resolved' && 'Bitumen patch leveling completed and verified. Drainage cleared. Citizen notified via SMS.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Step 9: Citizen Transparency Timeline Update
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                End-to-End Audit Trail Visible to Community
              </h3>

              <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Submitted &amp; Geotagged</span>
                    <p className="text-slate-500">28 Oct 2026, 09:15 AM · By Harpreet Singh</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Under Review by Executive Engineer</span>
                    <p className="text-slate-500">29 Oct 2026, 02:30 PM · Er. Gurdev Singh</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Action: Site Repairs Executed</span>
                    <p className="text-slate-500">30 Oct 2026, 04:00 PM · PWD Rural Division</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 10 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider">
                <Download className="w-4 h-4 text-emerald-600" />
                Step 10: Complete Project Transparency Report
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Official Civic Audit Ledger Ready for Printing &amp; Social Audit
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The full transparency report binds all records together: financial sanction vouchers, contractor GST details, AI computer vision findings, citizen grievances, and audit logs.
              </p>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-emerald-950 block text-sm">Sahnewal Road Transparency Ledger</span>
                  <span className="text-xs text-emerald-800">Project Code: JD-PRJ-2025-001 · Includes Full Audit Sheet</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenReportModal(1);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>View Printable Audit Ledger</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="text-xs text-slate-500 font-mono">
            Step {currentStep} of 10
          </div>

          {currentStep < 10 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(10, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('funds');
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
