import React, { useState, useEffect } from 'react';
import { DevelopmentNeed, District } from '../types';
import { fetchDevelopmentNeeds, submitDevelopmentNeed, upvoteDevelopmentNeed, fetchDistricts } from '../api';
import {
  Vote,
  ThumbsUp,
  Plus,
  Search,
  MapPin,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  Filter,
  Users
} from 'lucide-react';

interface CitizenVoiceSectionProps {
  currentUserRole?: string;
}

export const CitizenVoiceSection: React.FC<CitizenVoiceSectionProps> = ({ currentUserRole }) => {
  const [needs, setNeeds] = useState<DevelopmentNeed[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [endorsedIds, setEndorsedIds] = useState<Set<number>>(new Set());

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Rural Roads & Connectivity',
    description: '',
    district_id: 1,
    block_id: 1,
    panchayat_id: 1,
    lat: 30.9010,
    lng: 75.8573,
    citizen_name: '',
    citizen_phone: '',
    priority_score: 85
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const categories = [
    'All',
    'Rural Roads & Connectivity',
    'Drinking Water & Sanitation',
    'Solar Lighting & Energy',
    'Healthcare & Clinics',
    'Education & Skill Centers',
    'Drainage & Flood Control'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [nData, dData] = await Promise.all([
        fetchDevelopmentNeeds(),
        fetchDistricts()
      ]);
      setNeeds(nData);
      setDistricts(dData);
    } catch (err) {
      console.error('Failed to load development needs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndorse = async (id: number) => {
    if (endorsedIds.has(id)) return;
    try {
      const res = await upvoteDevelopmentNeed(id);
      setEndorsedIds(prev => new Set(prev).add(id));
      setNeeds(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, supporting_residents_count: (item.supporting_residents_count || 0) + 1, priority_score: res.need?.priority_score || item.priority_score + 2 }
            : item
        )
      );
      setFeedbackMessage('Your community endorsement has been recorded for Gram Sabha review!');
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Could not record endorsement.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await submitDevelopmentNeed(formData);
      setFeedbackMessage('Your development proposal has been registered and submitted to the Gram Panchayat Planning Committee!');
      setIsSubmitModalOpen(false);
      setFormData({
        title: '',
        category: 'Rural Roads & Connectivity',
        description: '',
        district_id: 1,
        block_id: 1,
        panchayat_id: 1,
        lat: 30.9010,
        lng: 75.8573,
        citizen_name: '',
        citizen_phone: '',
        priority_score: 80
      });
      loadData();
      setTimeout(() => setFeedbackMessage(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to register development need.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNeeds = needs.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.panchayat_name && n.panchayat_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  }).sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sanctioned':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Included in GPDP Plan':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Under Department Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-800 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <Vote className="w-3.5 h-3.5" />
              Democratic Rural Planning
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Citizen Voice: Community Development Needs Portal
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-3xl">
              Propose local development priorities directly to the Gram Sabha and District Administration. Community endorsements elevate urgent grassroots needs into the Gram Panchayat Development Plan (GPDP).
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Propose Development Need
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search proposals by title, village, or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Community Proposals */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          Loading community development proposals...
        </div>
      ) : filteredNeeds.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          No proposals found matching criteria. Be the first to propose a project for your village!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeeds.map((need, index) => {
            const hasEndorsed = endorsedIds.has(need.id);
            return (
              <div
                key={need.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {need.category}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(need.status)}`}>
                      {need.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {need.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{need.panchayat_name || 'Gram Panchayat'}, {need.district_name || 'Punjab'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {need.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Score: {need.priority_score || 80}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{need.supporting_residents_count || 1} Backers</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEndorse(need.id)}
                    disabled={hasEndorsed}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      hasEndorsed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasEndorsed ? 'fill-emerald-600' : ''}`} />
                    <span>{hasEndorsed ? 'Endorsed' : 'Endorse'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Propose Community Need */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Propose Village Development Need
                </h3>
                <p className="text-xs text-slate-500">
                  Submit a priority infrastructure or amenity requirement for Gram Sabha review.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Streetlights along canal road"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">District</label>
                  <select
                    value={formData.district_id}
                    onChange={e => setFormData({ ...formData, district_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Detailed Description & Beneficiaries</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the exact location, current bottleneck, and how many households or farmers will benefit..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaswant Singh"
                    value={formData.citizen_name}
                    onChange={e => setFormData({ ...formData, citizen_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Mobile Contact</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9814012345"
                    value={formData.citizen_phone}
                    onChange={e => setFormData({ ...formData, citizen_phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
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
                  {isSubmitting ? 'Registering Proposal...' : 'Submit to Gram Sabha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
