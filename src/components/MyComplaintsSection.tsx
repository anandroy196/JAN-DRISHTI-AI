import React, { useState, useEffect } from 'react';
import { Complaint, UserProfile } from '../types';
import { fetchMyComplaints, fetchComplaintDetail, submitComplaintFeedback } from '../api';
import { useI18n } from '../i18nContext';
import {
  FileText,
  Search,
  Filter,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Plus,
  RefreshCw,
  Star,
  Building,
  Check,
  Send,
  X
} from 'lucide-react';

interface MyComplaintsSectionProps {
  currentUser: UserProfile;
  onOpenReportForm: () => void;
  onSelectComplaintForTracking?: (id: string) => void;
}

export const MyComplaintsSection: React.FC<MyComplaintsSectionProps> = ({
  currentUser,
  onOpenReportForm,
  onSelectComplaintForTracking
}) => {
  const { t, tStatus, tCategory, language } = useI18n();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Detail & Timeline Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [timelineHistory, setTimelineHistory] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const filterOptions = [
    { id: 'all', labelKey: 'filterAll' as const },
    { id: 'submitted', labelKey: 'statusSubmitted' as const },
    { id: 'received', labelKey: 'statusReceived' as const },
    { id: 'under_review', labelKey: 'statusUnderReview' as const },
    { id: 'assigned', labelKey: 'statusAssigned' as const },
    { id: 'in_progress', labelKey: 'statusInProgress' as const },
    { id: 'resolved', labelKey: 'statusResolved' as const },
    { id: 'rejected', labelKey: 'statusRejected' as const }
  ];

  useEffect(() => {
    loadComplaints();
  }, [statusFilter, currentUser.phone]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyComplaints({
        phone: currentUser.phone || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined
      });
      setComplaints(data);
    } catch (err: any) {
      console.error('Failed to load my complaints:', err);
      setError(err.message || 'Could not load your complaints from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenTimeline = async (complaintId: number | string) => {
    try {
      setModalLoading(true);
      setSelectedComplaint(null);
      setFeedbackSuccess(false);
      const res = await fetchComplaintDetail(String(complaintId));
      setSelectedComplaint(res.complaint);
      setTimelineHistory(res.history || []);
    } catch (err: any) {
      alert(err.message || 'Failed to load complaint timeline.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      setFeedbackSubmitting(true);
      await submitComplaintFeedback(selectedComplaint.id, rating, feedbackComment);
      setFeedbackSuccess(true);
      setSelectedComplaint((prev: any) => ({
        ...prev,
        feedback_rating: rating,
        feedback_comment: feedbackComment
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to submit feedback.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const filteredList = complaints.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.reference_id.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.district_name && c.district_name.toLowerCase().includes(q)) ||
      (c.panchayat_name && c.panchayat_name.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('resolv') || s.includes('complete')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (s.includes('in progress') || s.includes('ongoing') || s.includes('work')) {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (s.includes('under review') || s.includes('assign')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    if (s.includes('reject')) {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>{t('navMyComplaints')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t('myComplaintsTitle')}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {t('myComplaintsSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadComplaints}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onOpenReportForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs sm:text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('reportProblem')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
          {filterOptions.map(opt => {
            const isActive = statusFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setStatusFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t(opt.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">{t('loading')}</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-red-50 border border-red-200 rounded-2xl space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="font-bold text-red-900 text-base">Error Loading Complaints</h3>
          <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
          <button
            onClick={loadComplaints}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            {t('tryAgain')}
          </button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">{t('noComplaintsFound')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{t('noComplaintsSub')}</p>
          </div>
          <button
            onClick={onOpenReportForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('reportProblem')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            <span>{filteredList.length} Complaints Registered on Record</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredList.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCopyId(item.reference_id)}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                      title={t('copyReferenceId')}
                    >
                      <span>{item.reference_id}</span>
                      {copiedId === item.reference_id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                      {tStatus(item.status)}
                    </span>

                    <span className="text-xs font-semibold text-slate-600">
                      {tCategory(item.category)}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.panchayat_name || 'Gram Panchayat'}, {item.district_name || 'Punjab'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t('submissionDate')}: {item.submitted_at}</span>
                    </div>

                    {item.assigned_official_name && (
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.assigned_to_role || 'Assigned'}: {item.assigned_official_name}</span>
                      </div>
                    )}
                  </div>

                  {item.resolution_notes && (
                    <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-900 block">{t('actionTaken')}:</span>
                      <span className="text-slate-600">{item.resolution_notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => handleOpenTimeline(item.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span>{t('viewTimeline')}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Updated: {item.updated_at}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline & Progress Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedComplaint.reference_id}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedComplaint.status)}`}>
                    {tStatus(selectedComplaint.status)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {tCategory(selectedComplaint.category)}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedComplaint.panchayat_name}, {selectedComplaint.district_name} • {selectedComplaint.submitted_at}
                </p>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Complaint Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-semibold text-slate-700 block">Report Description</span>
              <p className="text-slate-900 leading-relaxed text-sm">
                {selectedComplaint.description}
              </p>
              {selectedComplaint.photo_url && (
                <div className="mt-3">
                  <span className="text-slate-500 block mb-1">Attached Photographic Proof:</span>
                  <img
                    src={selectedComplaint.photo_url}
                    alt="Complaint Evidence"
                    className="max-h-48 rounded-lg border border-slate-200 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Lifecycle Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Official Lifecycle & Action History</span>
              </h4>

              {timelineHistory.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                  Initial dispatch recorded. Awaiting assignment to Panchayat nodal officer.
                </div>
              ) : (
                <div className="space-y-4 pl-3 border-l-2 border-emerald-500">
                  {timelineHistory.map((step, idx) => (
                    <div key={idx} className="relative pl-4 space-y-1">
                      <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {tStatus(step.new_status)}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600">{step.remarks}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        By: {step.officer_name} ({step.changed_by_role})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resolution Feedback (if resolved) */}
            {selectedComplaint.status?.toLowerCase().includes('resolv') && (
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-sm">
                    {t('feedback')}
                  </span>
                  {feedbackSuccess && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Feedback Saved
                    </span>
                  )}
                </div>

                {selectedComplaint.feedback_rating ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(selectedComplaint.feedback_rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    {selectedComplaint.feedback_comment && (
                      <p className="text-slate-700 italic">"{selectedComplaint.feedback_comment}"</p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-3">
                    <p className="text-slate-600">
                      How satisfied are you with the resolution of this issue?
                    </p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Optional feedback comment on the resolution..."
                      value={feedbackComment}
                      onChange={e => setFeedbackComment(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />

                    <button
                      type="submit"
                      disabled={feedbackSubmitting}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      {feedbackSubmitting ? 'Saving...' : t('submitFeedback')}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
              >
                {t('close')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
