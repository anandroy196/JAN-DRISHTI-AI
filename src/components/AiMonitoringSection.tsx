import React, { useState, useEffect } from 'react';
import { Project, MonitoringAnalysis } from '../types';
import { fetchProjects, fetchMonitoring, analyzeProgress, analyzeRoad, analyzeGreenery } from '../api';
import { 
  ScanLine, Eye, AlertTriangle, CheckCircle2, RefreshCw, 
  Camera, Upload, ArrowRight, Layers, Sliders, Sparkles, MapPin 
} from 'lucide-react';

interface AiMonitoringSectionProps {
  onSelectProject: (id: number) => void;
}

export const AiMonitoringSection: React.FC<AiMonitoringSectionProps> = ({ onSelectProject }) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'road' | 'greenery'>('progress');
  const [projects, setProjects] = useState<Project[]>([]);
  const [audits, setAudits] = useState<MonitoringAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  // Progress Auditor State
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [progressResult, setProgressResult] = useState<any>(null);
  const [analyzingProgress, setAnalyzingProgress] = useState(false);

  // Road Inspector State
  const [roadDistressResult, setRoadDistressResult] = useState<any>(null);
  const [analyzingRoad, setAnalyzingRoad] = useState(false);

  // Greenery State
  const [greeneryResult, setGreeneryResult] = useState<any>(null);
  const [analyzingGreenery, setAnalyzingGreenery] = useState(false);

  useEffect(() => {
    fetchProjects().then(setProjects);
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const data = await fetchMonitoring();
      setAudits(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunProgressAudit = async () => {
    setAnalyzingProgress(true);
    setProgressResult(null);
    try {
      const res = await analyzeProgress({
        project_id: selectedProjectId,
        after_image: '/assets/projects/site_sample.jpg',
        notes: 'Verification triggered from JanDrishti AI Monitoring Lab'
      });
      setProgressResult(res);
      await loadAudits();
    } catch (err: any) {
      alert(err.message || 'Audit failed');
    } finally {
      setAnalyzingProgress(false);
    }
  };

  const handleRunRoadInspection = async () => {
    setAnalyzingRoad(true);
    setRoadDistressResult(null);
    try {
      const res = await analyzeRoad({
        project_id: selectedProjectId,
        road_name: 'Sahnewal to Canal Bridge Corridor (KM 0.0 to KM 3.8)',
        image_url: '/assets/projects/road_pothole_scan.jpg'
      });
      setRoadDistressResult(res);
      await loadAudits();
    } catch (err: any) {
      alert(err.message || 'Road inspection failed');
    } finally {
      setAnalyzingRoad(false);
    }
  };

  const handleRunGreeneryAudit = async () => {
    setAnalyzingGreenery(true);
    setGreeneryResult(null);
    try {
      const res = await analyzeGreenery({
        project_id: selectedProjectId,
        location_title: 'Canal Bank Plantation & Social Forestry Perimeter',
        image_url: '/assets/projects/canal_greenery_scan.jpg'
      });
      setGreeneryResult(res);
      await loadAudits();
    } catch (err: any) {
      alert(err.message || 'Greenery inspection failed');
    } finally {
      setAnalyzingGreenery(false);
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Project Monitoring &amp; Vision Lab
          </h1>
          <p className="text-xs text-slate-500">
            Computer vision comparison of site photographs, road surface distress, and vegetative cover.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-mono font-medium">
            Inference: Deterministic Rule Engine + Gemini 2.5 Vision
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-full sm:w-max">
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'progress'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Progress Auditor (Before vs After)
        </button>

        <button
          onClick={() => setActiveTab('road')}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'road'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Road Surface &amp; Pothole Inspector
        </button>

        <button
          onClick={() => setActiveTab('greenery')}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'greenery'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Vegetation &amp; Greenery Scanner
        </button>
      </div>

      {/* Module 1: Progress Auditor */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          
          {/* Target Project Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Select Public Project to Audit
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(Number(e.target.value));
                  setProgressResult(null);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium focus:bg-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name} ({p.reported_progress_pct}% Reported)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunProgressAudit}
                disabled={analyzingProgress}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {analyzingProgress ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Cross-Examining Imagery...</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4 text-emerald-400" />
                    <span>Execute Computer Vision Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Before & After Visual Slider */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Comparative Photographic Slider
                  </h3>
                  <p className="text-xs text-slate-500">
                    Drag the slider to compare baseline earthwork against the latest inspection snapshot.
                  </p>
                </div>
                <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Split: {sliderPosition}%
                </span>
              </div>

              {/* Slider Viewport with CSS Canvas representation */}
              <div className="relative h-72 sm:h-80 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 select-none">
                
                {/* Baseline Layer (Left) */}
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-amber-950/60 via-amber-900/40 to-slate-800 flex items-center justify-start p-6"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                  <div className="space-y-2 text-white max-w-xs">
                    <span className="px-2 py-0.5 bg-black/60 rounded text-[10px] font-mono text-amber-300 uppercase tracking-wider">
                      Baseline: 15 Nov 2024
                    </span>
                    <h4 className="font-bold text-base">Initial Ground State</h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Uncompacted soil road with no drainage culverts. Physical progress recorded: 0%.
                    </p>
                  </div>
                </div>

                {/* Progress Layer (Right) */}
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950/70 flex items-center justify-end p-6"
                  style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                >
                  <div className="space-y-2 text-white max-w-xs text-right">
                    <span className="px-2 py-0.5 bg-black/60 rounded text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
                      Current Inspection: Oct 2026
                    </span>
                    <h4 className="font-bold text-base">Progress Snapshot</h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Sub-base granular layer placed. Asphalt wear course missing on 36% of road.
                    </p>
                  </div>
                </div>

                {/* Slider Divider Bar */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-md flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg text-[10px] font-bold">
                    ⇄
                  </div>
                </div>

                {/* Hidden Range Input on top of container */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>◀ Baseline Site Condition</span>
                <span>Drag slider to compare milestones</span>
                <span>Latest Progress Photo ▶</span>
              </div>
            </div>

            {/* Audit Result Panel */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Inspection Findings
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    Verification Engine
                  </span>
                </div>

                {progressResult ? (
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Model Estimated:</span>
                      <span className="font-mono font-bold text-base text-slate-900">
                        {progressResult.estimated_progress_pct}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Reported by Department:</span>
                      <span className="font-mono font-bold text-base text-blue-700">
                        {progressResult.administrative_reported_pct}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Calculated Variance:</span>
                      <span className={`font-mono font-bold text-base ${
                        progressResult.variance_pct < -15 ? 'text-red-700' : 'text-emerald-700'
                      }`}>
                        {progressResult.variance_pct}%
                      </span>
                    </div>

                    <div className={`p-3 rounded-lg border text-xs leading-relaxed space-y-1 ${
                      progressResult.status === 'flagged_for_review'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        {progressResult.status === 'flagged_for_review' ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                            <span>Statutory Audit Threshold Triggered</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Progress Consistent</span>
                          </>
                        )}
                      </div>
                      <p>{progressResult.findings_summary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                    <ScanLine className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>Click "Execute Computer Vision Audit" to generate live comparison.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                Audits are registered to the project permanent ledger and automatically notify district administrators if variance exceeds 15%.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Module 2: Road Surface & Pothole Inspector */}
      {activeTab === 'road' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Automated Road Distress &amp; Pothole Inspection
                </h3>
                <p className="text-xs text-slate-500">
                  Object detection model for identifying asphalt cracks, edge raveling, and depth-critical potholes.
                </p>
              </div>

              <button
                onClick={handleRunRoadInspection}
                disabled={analyzingRoad}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {analyzingRoad ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Scanning Surface Distress...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Run Road Surface Inspection</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual Surface Map Simulation */}
            <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 p-4 flex flex-col justify-between text-white">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-amber-400">SURFACE RECONNAISSANCE SCAN</span>
                <span className="text-[10px] text-slate-400 font-mono">Location: 30.8429° N, 75.9868° E</span>
              </div>

              {/* Bounding box simulation overlays */}
              <div className="relative flex-1 flex items-center justify-center">
                <div className="absolute left-1/4 top-1/3 w-24 h-16 border-2 border-red-500 rounded bg-red-500/10 flex items-start p-1">
                  <span className="text-[9px] font-mono bg-red-600 text-white px-1 rounded">
                    Pothole #1 (Depth: 48mm)
                  </span>
                </div>
                <div className="absolute right-1/3 bottom-1/4 w-28 h-20 border-2 border-amber-500 rounded bg-amber-500/10 flex items-start p-1">
                  <span className="text-[9px] font-mono bg-amber-600 text-white px-1 rounded">
                    Edge Distress #2
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                <span>Model: ResNet-FPN Road Distress Classifier</span>
                <span>Confidence: 89.2%</span>
              </div>
            </div>

            {/* Output Findings */}
            {roadDistressResult && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Potholes Detected:</span>
                  <span className="font-mono font-bold text-lg text-red-700">
                    {roadDistressResult.potholes_detected} Critical
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Surface Distress Index (SDI):</span>
                  <span className="font-mono font-bold text-lg text-amber-700">
                    {roadDistressResult.surface_distress_index}/100
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Condition Classification:</span>
                  <span className="font-mono font-bold text-lg text-slate-900">
                    {roadDistressResult.condition}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Module 3: Greenery & Canopy Scanner */}
      {activeTab === 'greenery' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Panchayat Vegetative Canopy &amp; Social Forestry Scanner
                </h3>
                <p className="text-xs text-slate-500">
                  Estimates tree canopy percentage and afforestation compliance along rural canal embankments.
                </p>
              </div>

              <button
                onClick={handleRunGreeneryAudit}
                disabled={analyzingGreenery}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {analyzingGreenery ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                    <span>Calculating Vegetative Index...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Scan Greenery Density</span>
                  </>
                )}
              </button>
            </div>

            {/* Greenery Viewport Simulation */}
            <div className="h-64 bg-emerald-950 rounded-lg overflow-hidden border border-emerald-900 p-4 flex flex-col justify-between text-white relative">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-emerald-300">NDVI SPECTRAL CANOPY SCAN</span>
                <span className="text-[10px] text-emerald-200/80 font-mono">Location: Kot Fatta Canal Belt</span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-400/40 bg-emerald-500/20 flex items-center justify-center font-mono font-bold text-xl text-emerald-300">
                  {greeneryResult ? `${greeneryResult.greenery_coverage_pct}%` : '78.4%'}
                </div>
                <span className="text-xs text-emerald-200">
                  Tree Canopy Coverage Index
                </span>
              </div>

              <div className="text-[11px] text-emerald-300/80 font-mono flex justify-between">
                <span>MGNREGA Target: &gt; 75% Sapling Survival</span>
                <span>Audit Status: Compliant</span>
              </div>
            </div>

            {greeneryResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Afforestation Target Satisfied</span>
                </div>
                <p>{greeneryResult.findings_summary}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            Recorded AI Vision Audits Ledger
          </span>
          <span className="text-slate-500 font-mono">
            {audits.length} Records Persisted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4">Audit Title &amp; Type</th>
                <th className="py-2.5 px-4">Project</th>
                <th className="py-2.5 px-4 text-center">Variance / SDI</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Inference Mode</th>
                <th className="py-2.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audits.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-semibold text-slate-900 block truncate">
                      {a.title}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      {a.analysis_type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-700 truncate max-w-xs">
                    {a.project_name || 'Public Project'}
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-medium">
                    {a.analysis_type === 'progress_audit' ? (
                      <span className={a.variance_pct < -15 ? 'text-red-700 font-bold' : 'text-slate-900'}>
                        {a.variance_pct}%
                      </span>
                    ) : a.analysis_type === 'road_condition' ? (
                      <span className="text-amber-700">SDI: {a.surface_distress_index}</span>
                    ) : (
                      <span className="text-emerald-700">{a.greenery_coverage_pct}%</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      a.status === 'flagged_for_review'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {a.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                    {a.inference_mode}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-mono whitespace-nowrap">
                    {a.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
