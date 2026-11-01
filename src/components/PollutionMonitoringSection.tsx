import React, { useState, useEffect } from 'react';
import { PollutionReport, District } from '../types';
import { fetchPollutionReports, submitPollutionReport, analyzePollutionCause } from '../api';
import { 
  Wind, Droplets, AlertTriangle, CheckCircle2, 
  MapPin, Activity, Sparkles, RefreshCw, Send, ShieldAlert, BarChart2 
} from 'lucide-react';

interface PollutionMonitoringSectionProps {
  districts?: District[];
  currentUserRole?: string;
}

export const PollutionMonitoringSection: React.FC<PollutionMonitoringSectionProps> = ({ districts = [], currentUserRole }) => {
  const [reports, setReports] = useState<PollutionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [causeAnalysisModal, setCauseAnalysisModal] = useState<any | null>(null);
  const [analyzingCause, setAnalyzingCause] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [location, setLocation] = useState('');
  const [districtId, setDistrictId] = useState(1);
  const [category, setCategory] = useState<'Air pollution' | 'Water pollution' | 'Industrial emissions'>('Air pollution');
  const [aqi, setAqi] = useState(165);
  const [pm25, setPm25] = useState(58.0);
  const [pm10, setPm10] = useState(115.0);
  const [causes, setCauses] = useState('');
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReports();
  }, [selectedCategory]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchPollutionReports({
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCauseAnalysis = async (report: PollutionReport) => {
    setAnalyzingCause(true);
    try {
      const res = await analyzePollutionCause({
        category: report.category,
        aqi: report.aqi,
        location: report.location
      });
      setCauseAnalysisModal({
        report,
        analysis: res
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingCause(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitPollutionReport({
        location,
        district_id: districtId,
        category,
        aqi: Number(aqi),
        pm25: Number(pm25),
        pm10: Number(pm10),
        possible_causes: causes || 'Vehicle emissions along main road',
        supporting_evidence: evidence || 'Citizen observed soot and portable air monitor',
        data_source: 'Citizen Environmental Post'
      });
      setShowForm(false);
      setLocation('');
      setCauses('');
      setEvidence('');
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getAqiColor = (val: number) => {
    if (val <= 50) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val <= 100) return 'text-lime-800 bg-lime-50 border-lime-200';
    if (val <= 200) return 'text-amber-800 bg-amber-50 border-amber-200';
    if (val <= 300) return 'text-orange-800 bg-orange-50 border-orange-200';
    return 'text-red-800 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Action */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Environmental Pollution Detection &amp; Cause Analysis
          </h1>
          <p className="text-xs text-slate-500">
            Scientific air &amp; water monitoring with multi-factor evidence-based source attribution.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showForm ? 'Cancel Form' : 'Log Pollution Observation'}</span>
        </button>
      </div>

      {/* Cause Analysis Principles Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
        <span className="font-semibold text-slate-900 block">
          Constitutional Principles of JanDrishti Pollution Cause Analysis:
        </span>
        <p>
          Pollution cause analyses represent scientific hypotheses based on sensor correlations, thermal satellite clusters, and proximity zoning. They are designed to direct statutory inspection teams, not to level unfounded legal accusations.
        </p>
      </div>

      {/* Observation Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900">
              Record Environmental Measurement / Observation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Area / Locality *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sahnewal Canal Industrial Belt"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pollution Medium *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              >
                <option value="Air pollution">Air pollution</option>
                <option value="Water pollution">Water pollution</option>
                <option value="Industrial emissions">Industrial emissions</option>
                <option value="Open waste burning">Open waste burning</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">AQI / Index Reading</label>
              <input
                type="number"
                value={aqi}
                onChange={(e) => setAqi(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PM2.5 (µg/m³)</label>
              <input
                type="number"
                step="0.1"
                value={pm25}
                onChange={(e) => setPm25(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PM10 (µg/m³)</label>
              <input
                type="number"
                step="0.1"
                value={pm10}
                onChange={(e) => setPm10(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Observed Source Clues</label>
              <input
                type="text"
                placeholder="e.g. Heavy diesel trucks, factory chimney smoke, agricultural burning"
                value={causes}
                onChange={(e) => setCauses(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supporting Evidence</label>
              <input
                type="text"
                placeholder="e.g. Local air post reading, photographic soot on crops"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Save Environmental Reading</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-max">
        {(['all', 'Air pollution', 'Water pollution', 'Industrial emissions'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === cat ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'all' ? 'All Mediums' : cat}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading sensor and citizen observations...</div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-xl">
            No pollution reports found for this medium.
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {report.reference_id}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {report.category}
                    </span>
                    <span>·</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Timestamp: {report.recorded_date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 pt-1">
                    {report.location} ({report.district_name || 'Punjab'})
                  </h3>

                  <p className="text-xs text-slate-600 pt-0.5">
                    <strong>Sensor / Report Source:</strong> {report.data_source}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border text-center ${getAqiColor(report.aqi)}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">AQI Reading</span>
                    <span className="text-xl font-bold font-mono">{report.aqi}</span>
                  </div>

                  <div className="text-xs space-y-0.5 font-mono text-slate-600">
                    <div>PM2.5: <strong className="text-slate-900">{report.pm25} {report.reading_unit}</strong></div>
                    <div>PM10: <strong className="text-slate-900">{report.pm10} {report.reading_unit}</strong></div>
                  </div>
                </div>
              </div>

              {/* Contributing Causes Strip */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Observed Contributing Factors:
                </span>
                <p className="font-medium text-slate-900">{report.possible_causes}</p>
                <p className="text-slate-500 text-[11px]">
                  <strong>Evidence:</strong> {report.supporting_evidence}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Status: {report.status}
                </span>

                <button
                  onClick={() => handleRunCauseAnalysis(report)}
                  disabled={analyzingCause}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Execute AI Source Attribution →</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* AI Cause Analysis Modal */}
      {causeAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 text-xs text-slate-900 max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">
                AI Multi-Source Environmental Attribution
              </span>
              <button
                onClick={() => setCauseAnalysisModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600">
              Evaluated location: <strong>{causeAnalysisModal.analysis.location}</strong>. 
              Correlated with wind vectors, local industrial emissions registries, and agricultural satellite alerts:
            </p>

            <div className="space-y-2">
              {causeAnalysisModal.analysis.factors.map((f: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>{f.factor}</span>
                    <span className="font-mono text-emerald-700">{f.probability} Probability</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{f.evidence}</p>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
              {causeAnalysisModal.analysis.disclaimer}
            </div>

            <button
              onClick={() => setCauseAnalysisModal(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg font-semibold"
            >
              Close Attribution Model
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
