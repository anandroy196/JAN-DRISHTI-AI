import React, { useState, useEffect } from 'react';
import { Complaint, District, Block, Panchayat, Project, UserRole } from '../types';
import { 
  fetchComplaints, fetchComplaintDetail, submitComplaint, 
  updateComplaintStatus, submitComplaintFeedback, fetchDistricts, 
  fetchBlocks, fetchPanchayats, fetchProjects 
} from '../api';
import { useI18n } from '../i18nContext';
import { 
  AlertCircle, CheckCircle2, Clock, MapPin, Camera, 
  Search, ShieldCheck, ChevronRight, Star, Send, RefreshCw, UserCheck, Copy, Check, FileText,
  PhoneCall, HelpCircle, Shield, AlertTriangle, Info, Compass, Sparkles
} from 'lucide-react';

interface GrievancesSectionProps {
  currentUserRole: UserRole;
  initialTrackId?: string;
  onNavigateToMyComplaints?: () => void;
}

export const GrievancesSection: React.FC<GrievancesSectionProps> = ({
  currentUserRole,
  initialTrackId,
  onNavigateToMyComplaints
}) => {
  const { t, tStatus, tCategory, language } = useI18n();
  const [copiedRef, setCopiedRef] = useState(false);
  const [activeTab, setActiveTab] = useState<'register' | 'track' | 'ledger'>('register');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [panchayats, setPanchayats] = useState<Panchayat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Registration Form State
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [category, setCategory] = useState('Damaged roads');
  const [description, setDescription] = useState('');
  const [districtId, setDistrictId] = useState<number>(1);
  const [blockId, setBlockId] = useState<number>(1);
  const [panchayatId, setPanchayatId] = useState<number>(2);
  const [projectId, setProjectId] = useState<number | undefined>(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number }>({ lat: 30.8429, lng: 75.9868 });
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ reference_id: string; id: number } | null>(null);

  // Tracking Lookup State
  const [trackInput, setTrackInput] = useState(initialTrackId || 'JD-2026-8812');
  const [trackedComplaint, setTrackedComplaint] = useState<any | null>(null);
  const [trackHistory, setTrackHistory] = useState<any[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Officer Status Update Action State
  const [selectedNewStatus, setSelectedNewStatus] = useState<string>('In Progress');
  const [officerRemarks, setOfficerRemarks] = useState<string>('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Ledger Filter State
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerCategoryFilter, setLedgerCategoryFilter] = useState('all');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState('all');

  const categories = [
    'Damaged roads',
    'Water supply',
    'Electricity',
    'Drainage and sanitation',
    'Incomplete public projects',
    'Suspected fund misuse',
    'Public infrastructure problems',
    'Other civic issues'
  ];

  useEffect(() => {
    fetchDistricts().then(setDistricts);
    fetchBlocks(1).then(setBlocks);
    fetchPanchayats(1).then(setPanchayats);
    fetchProjects().then(setProjects);
    loadComplaints();

    if (initialTrackId) {
      setActiveTab('track');
      handleLookup(initialTrackId);
    }
  }, [initialTrackId]);

  const loadComplaints = async () => {
    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDistrictChange = async (dId: number) => {
    setDistrictId(dId);
    const bList = await fetchBlocks(dId);
    setBlocks(bList);
    if (bList.length > 0) {
      setBlockId(bList[0].id);
      const pList = await fetchPanchayats(bList[0].id);
      setPanchayats(pList);
      if (pList.length > 0) setPanchayatId(pList[0].id);
    }
  };

  const handleBlockChange = async (bId: number) => {
    setBlockId(bId);
    const pList = await fetchPanchayats(bId);
    setPanchayats(pList);
    if (pList.length > 0) setPanchayatId(pList[0].id);
  };

  // Resize + compress phone photos before upload (raw camera images are 5-10 MB and make submit slow/fail)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPG / PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const original = reader.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const MAX = 1280;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) { setPhotoPreview(original); return; }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setPhotoPreview(canvas.toDataURL('image/jpeg', 0.8));
        } catch {
          setPhotoPreview(original);
        }
      };
      img.onerror = () => setPhotoPreview(original);
      img.src = original;
    };
    reader.readAsDataURL(file);
  };

  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      alert('GPS is not supported on this device/browser. Panchayat center coordinates will be used.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        alert('GPS permission not granted. Defaulting to local Panchayat center coordinates.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitComplaint({
        citizen_name: citizenName,
        citizen_phone: citizenPhone,
        district_id: districtId,
        block_id: blockId,
        panchayat_id: panchayatId,
        project_id: projectId || null,
        category,
        description,
        photo_url: photoPreview,
        lat: gpsLocation.lat,
        lng: gpsLocation.lng,
        priority: 'high'
      });

      setSubmissionSuccess({
        reference_id: res.reference_id,
        id: res.complaint_id
      });
      await loadComplaints();
    } catch (err: any) {
      alert(err.message || 'Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (idToLookUp?: string) => {
    const id = idToLookUp || trackInput;
    if (!id) return;
    setTrackingLoading(true);
    setTrackedComplaint(null);
    setTrackHistory([]);
    try {
      const res = await fetchComplaintDetail(id.trim());
      setTrackedComplaint(res.complaint);
      setTrackHistory(res.history || []);
      setFeedbackSubmitted(Boolean(res.complaint.feedback_rating));
    } catch (err: any) {
      alert('Complaint reference code not found in records.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!trackedComplaint) return;
    setStatusUpdating(true);
    try {
      await updateComplaintStatus(trackedComplaint.id, {
        new_status: selectedNewStatus,
        officer_name: 'Er. Gurdev Singh',
        officer_role: 'Executive Engineer (PWD Rural)',
        remarks: officerRemarks || `Status marked as ${selectedNewStatus}`
      });
      await handleLookup(trackedComplaint.reference_id);
      await loadComplaints();
      setOfficerRemarks('');
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackedComplaint) return;
    try {
      await submitComplaintFeedback(trackedComplaint.id, feedbackRating, feedbackComment);
      setFeedbackSubmitted(true);
      await handleLookup(trackedComplaint.reference_id);
    } catch (err: any) {
      alert(err.message || 'Feedback failed');
    }
  };

  // Filtered Ledger Complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      c.reference_id.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (c.panchayat_name && c.panchayat_name.toLowerCase().includes(ledgerSearch.toLowerCase()));
    const matchesCategory = ledgerCategoryFilter === 'all' || c.category === ledgerCategoryFilter;
    const matchesStatus = ledgerStatusFilter === 'all' || c.status.toLowerCase().replace(/\s+/g, '_') === ledgerStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'Assigned').length;

  return (
    <div className="space-y-6 pb-16 w-full max-w-full">
      
      {/* Title & Description Banner */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Citizen Grievance &amp; Redressal Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Direct, tamper-proof civic reporting channel connecting rural citizens with district executive engineers.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Right to Service (RTS) Enforced</span>
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-max overflow-x-auto">
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Register New Grievance
        </button>
        <button
          onClick={() => {
            setActiveTab('track');
            if (!trackedComplaint) handleLookup('JD-2026-8812');
          }}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'track' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Track Grievance Status
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Public Grievances Ledger ({complaints.length})
        </button>
      </div>

      {/* Tabs 1 & 2: Responsive 12-Column Layout */}
      {(activeTab === 'register' || activeTab === 'track') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
          
          {/* Main Primary Action Column (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6 w-full">
            
            {/* Tab 1: Registration Form */}
            {activeTab === 'register' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-2xs">
                {submissionSuccess ? (
                  <div className="text-center py-6 sm:py-8 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        Grievance Persisted in Official Ledger
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Your complaint has been registered with high priority and dispatched for statutory field inspection.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto space-y-2">
                      <span className="text-xs text-slate-500 block">Permanent Reference Tracking ID</span>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-2xl font-bold text-slate-900 tracking-wider">
                          {submissionSuccess.reference_id}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(submissionSuccess.reference_id);
                            setCopiedRef(true);
                            setTimeout(() => setCopiedRef(false), 2000);
                          }}
                          className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Copy ID"
                        >
                          {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Save this reference code to monitor officer inspection notes &amp; resolution photos.
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 pt-3">
                      {onNavigateToMyComplaints && (
                        <button
                          onClick={onNavigateToMyComplaints}
                          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t('navMyComplaints')}</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setTrackInput(submissionSuccess.reference_id);
                          setActiveTab('track');
                          handleLookup(submissionSuccess.reference_id);
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        Track This Grievance
                      </button>
                      <button
                        onClick={() => {
                          setSubmissionSuccess(null);
                          setDescription('');
                          setPhotoPreview(null);
                        }}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                      >
                        File Another Grievance
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitGrievance} className="space-y-5">
                    
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-base font-bold text-slate-900">
                        Lodge Public Infrastructure or Fund Grievance
                      </h2>
                      <p className="text-xs text-slate-500">
                        Fields marked with * are required. Citizen telephone details are protected under state privacy norms.
                      </p>
                    </div>

                    {/* Citizen Particulars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Harpreet Singh"
                          value={citizenName}
                          onChange={(e) => setCitizenName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mobile Number (For SMS Status Alerts) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98721 XXXXX"
                          value={citizenPhone}
                          onChange={(e) => setCitizenPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    {/* Geographic Hierarchy Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          District *
                        </label>
                        <select
                          value={districtId}
                          onChange={(e) => handleDistrictChange(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                        >
                          {districts.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Development Block *
                        </label>
                        <select
                          value={blockId}
                          onChange={(e) => handleBlockChange(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                        >
                          {blocks.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Gram Panchayat *
                        </label>
                        <select
                          value={panchayatId}
                          onChange={(e) => setPanchayatId(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                        >
                          {panchayats.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Category & Associated Project */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Grievance Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Associated Public Work (Optional)
                        </label>
                        <select
                          value={projectId || ''}
                          onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                        >
                          <option value="">General Panchayat Civic Issue</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.code} — {p.name.substring(0, 45)}...
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Issue Description &amp; Specific Location Details *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe the defect, stalled work, water stagnation, or contractor delay with specific landmarks..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Photo Upload & Geotag Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 flex flex-col justify-center items-center">
                        <Camera className="w-6 h-6 text-slate-400 mb-1" />
                        <label className="cursor-pointer text-xs font-semibold text-emerald-700 hover:underline block">
                          Upload Site Photograph
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-slate-400 block pt-0.5">
                          JPG/PNG up to 10MB
                        </span>
                        {photoPreview && (
                          <span className="text-[10px] text-emerald-600 font-semibold block pt-1">
                            ✓ Image Attached ({photoPreview.slice(0, 25)}...)
                          </span>
                        )}
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            GPS Coordinates
                          </span>
                          <button
                            type="button"
                            onClick={handleCaptureGps}
                            className="text-[11px] text-emerald-700 font-semibold hover:underline"
                          >
                            Detect Live GPS
                          </button>
                        </div>
                        <div className="font-mono text-xs text-slate-900 bg-white p-2 rounded-lg border border-slate-200 mt-2 text-center font-medium">
                          {gpsLocation.lat.toFixed(4)}° N, {gpsLocation.lng.toFixed(4)}° E
                        </div>
                        <span className="text-[10px] text-slate-400 pt-1 text-center">
                          Automated GIS geotagging embedded in ticket.
                        </span>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Validating and Persisting to Ledger...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Grievance to District Authorities</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}
              </div>
            )}

            {/* Tab 2: Track Grievance Status */}
            {activeTab === 'track' && (
              <div className="space-y-6 w-full">
                
                {/* Tracking Search Input */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter Reference ID (e.g. JD-2026-8812)"
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleLookup()}
                    disabled={trackingLoading}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    {trackingLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Track Ticket</span>
                  </button>
                </div>

                {/* Ticket Details & Lifecycle Timeline */}
                {trackedComplaint ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-2xs space-y-6">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-200">
                          {trackedComplaint.reference_id}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-2">
                          {trackedComplaint.category}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                          trackedComplaint.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : trackedComplaint.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          Status: {trackedComplaint.status}
                        </span>
                      </div>
                    </div>

                    {/* Description & Location */}
                    <div className="space-y-3 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed italic">
                        "{trackedComplaint.description}"
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-500 pt-1">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Gram Panchayat</span>
                          <span className="font-semibold text-slate-900 text-xs">{trackedComplaint.panchayat_name}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">District</span>
                          <span className="font-semibold text-slate-900 text-xs">{trackedComplaint.district_name}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Filing Date</span>
                          <span className="font-mono text-slate-700 text-xs">{trackedComplaint.submitted_at}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Coordinates</span>
                          <span className="font-mono text-slate-700 text-xs">{trackedComplaint.lat.toFixed(4)}°, {trackedComplaint.lng.toFixed(4)}°</span>
                        </div>
                      </div>
                    </div>

                    {/* Official Action Box for Authorized Roles */}
                    {(currentUserRole === 'official' || currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
                      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-950 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-blue-700" />
                            Executive Officer Workflow Action
                          </span>
                          <span className="text-[10px] font-mono text-blue-700">Role: {currentUserRole}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-blue-900 font-semibold mb-1">
                              Transition Status To:
                            </label>
                            <select
                              value={selectedNewStatus}
                              onChange={(e) => setSelectedNewStatus(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-white text-slate-900"
                            >
                              <option value="Under Review">Under Review</option>
                              <option value="Assigned">Assigned to Field Engineer</option>
                              <option value="In Progress">In Progress (Work Commenced)</option>
                              <option value="Resolved">Resolved (Verification Complete)</option>
                              <option value="Rejected">Rejected with Reason</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-blue-900 font-semibold mb-1">
                              Statutory Remarks / Resolution Notes:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Contractor served notice; bitumen cold-mix repair executed."
                              value={officerRemarks}
                              onChange={(e) => setOfficerRemarks(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-white text-slate-900"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleUpdateStatus}
                          disabled={statusUpdating}
                          className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg text-xs transition-colors"
                        >
                          {statusUpdating ? 'Updating Ledger...' : 'Commit Status Update'}
                        </button>
                      </div>
                    )}

                    {/* Status History Timeline */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Audit Lifecycle History ({trackHistory.length} Recorded Steps)
                      </h4>

                      <div className="space-y-3 border-l-2 border-slate-200 ml-2 pl-4 text-xs">
                        {trackHistory.map((h) => (
                          <div key={h.id} className="relative space-y-1">
                            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white" />
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">
                                {h.new_status}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">
                                {h.timestamp}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px]">{h.remarks}</p>
                            <span className="text-[10px] text-slate-400 block">
                              Action by: {h.officer_name} ({h.changed_by_role})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Citizen Feedback Form if Resolved */}
                    {trackedComplaint.status === 'Resolved' && (
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900">
                          Citizen Redressal Feedback
                        </h4>

                        {feedbackSubmitted ? (
                          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Thank you! Your satisfaction feedback has been permanently recorded in the district ledger.</span>
                          </div>
                        ) : (
                          <form onSubmit={handleFeedbackSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-700 font-medium">Rate department resolution quality:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() => setFeedbackRating(star)}
                                    className={`p-1 text-base ${star <= feedbackRating ? 'text-amber-500' : 'text-slate-300'}`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>

                            <input
                              type="text"
                              placeholder="Add your comments on the quality of work executed on site..."
                              value={feedbackComment}
                              onChange={(e) => setFeedbackComment(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs"
                            />

                            <button
                              type="submit"
                              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg text-xs transition-colors"
                            >
                              Submit Verification Feedback
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
                    <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-medium text-slate-700">Enter a Tracking Code to view live progress</p>
                    <p className="text-xs text-slate-400">Example reference numbers: JD-2026-8812, JD-2026-1042</p>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right Sidebar: Civic Guidance, Statutory SLAs & Escalation Matrix (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5 w-full">
            
            {/* Card 1: Statutory SLA Guarantees */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Statutory Turnaround Standards (SLA)
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Drinking Water &amp; Pipelines</span>
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    24 Hours
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Drainage &amp; Waste Stagnation</span>
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    48 Hours
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Village Streetlights &amp; Power</span>
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    48 Hours
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">School / Health Infrastructure</span>
                  <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    72 Hours
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">PWD Bitumen Road Repairs</span>
                  <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    7 Days
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Enforced under Punjab Right to Service Act, 2011. Automatic escalation upon breach.
              </p>
            </div>

            {/* Card 2: Filing Best Practices */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  How to File High-Impact Grievances
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Clear daylight photograph:</strong> Capture defects with landmarks (e.g. school gate, water tank).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Enable Live GPS:</strong> Geotags verify your physical location at the affected panchayat site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Specify contractor details:</strong> Mention project board code if available on the signpost.</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Multi-Tier Escalation Matrix */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Official Escalation Matrix
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block">Tier 1: Gram Panchayat</span>
                  <span className="text-[11px] text-slate-500">Panchayat Secretary &amp; Sarpanch Inspection</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block">Tier 2: Block Level</span>
                  <span className="text-[11px] text-slate-500">Block Development &amp; Panchayat Officer (BDPO)</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block">Tier 3: District Authority</span>
                  <span className="text-[11px] text-slate-500">District Executive Engineer (XEN) / Deputy Commissioner</span>
                </div>
              </div>
            </div>

            {/* Card 4: Toll-Free Helpline */}
            <div className="bg-gradient-to-br from-emerald-800 to-slate-900 text-white rounded-xl p-5 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <PhoneCall className="w-4 h-4" />
                <span>Punjab Rural Helpline</span>
              </div>
              <p className="font-mono text-2xl font-bold tracking-wider">
                1100 <span className="text-xs font-sans text-slate-300 font-normal">/ 1800-180-2022</span>
              </p>
              <p className="text-[11px] text-slate-300 leading-snug">
                Toll-free citizen assistance available Mon–Sat (09:00 AM – 05:00 PM) in Punjabi, Hindi &amp; English.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Tab 3: Public Grievance Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-5 w-full">
          
          {/* Metrics Overview Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Registered</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">{totalComplaints}</span>
              <span className="text-[10px] text-slate-500 block pt-0.5">Across 4 Districts</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">Under Review</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-700 font-mono">{pendingComplaints}</span>
              <span className="text-[10px] text-slate-500 block pt-0.5">Queued for Inspection</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-blue-600 block">Work In Progress</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-700 font-mono">{inProgressComplaints}</span>
              <span className="text-[10px] text-slate-500 block pt-0.5">Field Engineers Assigned</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Resolved &amp; Closed</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono">{resolvedComplaints}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block pt-0.5">Verified on site</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Tracking Code, Issue keyword, or Panchayat..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={ledgerCategoryFilter}
                onChange={(e) => setLedgerCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={ledgerStatusFilter}
                onChange={(e) => setLedgerStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table Container with Controlled Overflow */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4">Category &amp; Issue</th>
                    <th className="py-3 px-4">Gram Panchayat</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Officer</th>
                    <th className="py-3 px-4 text-right">Filed Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No complaints match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {c.reference_id}
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-semibold text-slate-900 block truncate">
                            {c.category}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {c.description}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          {c.panchayat_name || 'Gram Panchayat'}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            c.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : c.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {c.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {c.assigned_official_name || 'Under Dispatch'}
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-slate-500 whitespace-nowrap">
                          {c.submitted_at.substring(0, 10)}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setTrackInput(c.reference_id);
                              setActiveTab('track');
                              handleLookup(c.reference_id);
                            }}
                            className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                          >
                            Track History →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
