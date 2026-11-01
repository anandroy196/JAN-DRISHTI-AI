import React, { useEffect, useRef, useState } from 'react';
import { Project, Complaint, Panchayat } from '../types';
import { fetchProjects, fetchComplaints, fetchPanchayats } from '../api';
import L from 'leaflet';
import { 
  MapPin, Layers, Filter, CheckCircle2, AlertTriangle, 
  Clock, Eye, Building2, ChevronRight, X 
} from 'lucide-react';

interface VillageMapSectionProps {
  onSelectProject: (id: number) => void;
  onOpenGrievanceForm: () => void;
}

export const VillageMapSection: React.FC<VillageMapSectionProps> = ({
  onSelectProject,
  onOpenGrievanceForm
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [panchayats, setPanchayats] = useState<Panchayat[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'projects' | 'complaints' | 'roads' | 'greenery'>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');

  useEffect(() => {
    Promise.all([fetchProjects(), fetchComplaints(), fetchPanchayats()]).then(
      ([pData, cData, gpData]) => {
        setProjects(pData);
        setComplaints(cData);
        setPanchayats(gpData);
      }
    );
  }, []);

  // Create / destroy the Leaflet map whenever the map view is shown or hidden.
  // (Previously the map was never destroyed, so switching to the table and back left a dead map.)
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [30.9010, 75.8573],
      zoom: 9,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    renderMarkers();

    // Fix grey/partial tiles when the container size settles after layout
    const t = window.setTimeout(() => map.invalidateSize(), 150);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, [viewMode]);

  useEffect(() => {
    renderMarkers();
  }, [projects, complaints, panchayats, activeCategory, viewMode]);

  const renderMarkers = () => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    // Custom Icon Creators
    const createMarkerIcon = (color: string, label: string) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; font-family: sans-serif;">
            ${label}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
    };

    // Render Projects
    if (activeCategory === 'all' || activeCategory === 'projects') {
      projects.forEach((prj) => {
        if (!prj.lat || !prj.lng) return;
        const color = prj.status === 'completed' ? '#16a34a' : prj.status === 'delayed' ? '#d97706' : '#2563eb';
        const icon = createMarkerIcon(color, 'P');
        const marker = L.marker([prj.lat, prj.lng], { icon });

        marker.on('click', () => {
          setSelectedItem({ type: 'project', data: prj });
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // Render Complaints
    if (activeCategory === 'all' || activeCategory === 'complaints') {
      complaints.forEach((cmp) => {
        if (!cmp.lat || !cmp.lng) return;
        const color = cmp.status === 'Resolved' ? '#059669' : '#dc2626';
        const icon = createMarkerIcon(color, '!');
        const marker = L.marker([cmp.lat, cmp.lng], { icon });

        marker.on('click', () => {
          setSelectedItem({ type: 'complaint', data: cmp });
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // Render Panchayats
    if (activeCategory === 'all') {
      panchayats.forEach((gp) => {
        if (!gp.lat || !gp.lng) return;
        const icon = createMarkerIcon('#475569', 'GP');
        const marker = L.marker([gp.lat, gp.lng], { icon });

        marker.on('click', () => {
          setSelectedItem({ type: 'panchayat', data: gp });
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Smart Village Development Map
          </h1>
          <p className="text-xs text-slate-500">
            OpenStreetMap geospatial visualization of projects, citizen grievances, and environmental audits.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Map
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Geographic Directory Table
          </button>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-semibold mr-1">Layer:</span>
        {[
          { id: 'all', label: 'All Markers' },
          { id: 'projects', label: 'Development Projects (P)' },
          { id: 'complaints', label: 'Citizen Grievances (!)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Map + Side Detail Card View */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Leaflet Map Canvas */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs relative isolate">
            <div ref={mapContainerRef} className="relative z-0 w-full h-[360px] sm:h-[460px] lg:h-[520px]" />

            {/* Static Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-3 shadow-md text-[11px] space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">Map Legend</span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span>Completed Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Ongoing Infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Delayed / Flagged Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span>Citizen Road / Civic Grievances</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-600" />
                <span>Gram Panchayat Center</span>
              </div>
            </div>
          </div>

          {/* Marker Detail Sidebar */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Selected Location Object
                  </span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {selectedItem.type === 'project' && (
                  <div className="space-y-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {selectedItem.data.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {selectedItem.data.name}
                    </h3>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Sanctioned:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          ₹{(selectedItem.data.sanctioned_amount / 100000).toFixed(1)} Lakh
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disbursed:</span>
                        <span className="font-mono font-semibold text-emerald-700">
                          ₹{(selectedItem.data.recorded_expenditure / 100000).toFixed(1)} Lakh
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progress:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {selectedItem.data.reported_progress_pct}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-mono text-slate-700">
                          {selectedItem.data.lat.toFixed(4)}°, {selectedItem.data.lng.toFixed(4)}°
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectProject(selectedItem.data.id)}
                      className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                      Inspect Full Project Audit
                    </button>
                  </div>
                )}

                {selectedItem.type === 'complaint' && (
                  <div className="space-y-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold border border-red-200">
                      {selectedItem.data.reference_id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      Category: {selectedItem.data.category}
                    </h3>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                      "{selectedItem.data.description}"
                    </p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-semibold text-slate-900">{selectedItem.data.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complainant:</span>
                        <span>{selectedItem.data.citizen_name}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'panchayat' && (
                  <div className="space-y-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {selectedItem.data.code}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">
                      Gram Panchayat {selectedItem.data.name}
                    </h3>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Population:</span>
                        <span className="font-mono font-medium">{selectedItem.data.population} residents</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coordinates:</span>
                        <span className="font-mono">{selectedItem.data.lat}°, {selectedItem.data.lng}°</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-300" />
                <p>Click any map marker pin to review its localized civic details.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                onClick={onOpenGrievanceForm}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
              >
                Log Grievance at Current Location
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Table Fallback View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Entity &amp; Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Latitude</th>
                <th className="py-3 px-4">Longitude</th>
                <th className="py-3 px-4">Status / Details</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={`p-${p.id}`} className="hover:bg-slate-50">
                  <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                      Project
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{p.lat.toFixed(4)}°</td>
                  <td className="py-3 px-4 font-mono">{p.lng.toFixed(4)}°</td>
                  <td className="py-3 px-4 capitalize">{p.status} ({p.reported_progress_pct}%)</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
              {complaints.map((c) => (
                <tr key={`c-${c.id}`} className="hover:bg-slate-50">
                  <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-900">
                    {c.category} — {c.description.substring(0, 50)}...
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 font-medium">
                      Grievance
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{c.lat.toFixed(4)}°</td>
                  <td className="py-3 px-4 font-mono">{c.lng.toFixed(4)}°</td>
                  <td className="py-3 px-4 font-medium">{c.status}</td>
                  <td className="py-3 px-4 text-right text-slate-500 font-mono">
                    {c.reference_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
