export type UserRole = 'citizen' | 'official' | 'admin' | 'superadmin';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  designation?: string;
  department?: string;
  assigned_district_id?: number;
  state?: string;
  district?: string;
  locality?: string;
}

export interface District {
  id: number;
  name: string;
  state: string;
  code: string;
  total_sanctioned: number;
  total_released: number;
  total_spent: number;
}

export interface Block {
  id: number;
  district_id: number;
  name: string;
  code: string;
}

export interface Panchayat {
  id: number;
  block_id: number;
  name: string;
  code: string;
  lat: number;
  lng: number;
  population: number;
}

export interface Project {
  id: number;
  code: string;
  name: string;
  state: string;
  district_id: number;
  district_name?: string;
  block_id: number;
  block_name?: string;
  panchayat_id: number;
  panchayat_name?: string;
  department: string;
  scheme: string;
  contractor_name: string;
  contractor_id: string;
  sanctioned_amount: number;
  released_amount: number;
  paid_to_contractor: number;
  recorded_expenditure: number;
  start_date: string;
  expected_completion: string;
  actual_completion?: string;
  reported_progress_pct: number;
  status: 'planned' | 'ongoing' | 'completed' | 'delayed' | 'halted';
  official_source_url: string;
  source_name: string;
  data_retrieval_date: string;
  verification_status: 'verified' | 'unverified' | 'flagged';
  lat: number;
  lng: number;
  description: string;
  is_demo: number;
}

export interface Complaint {
  id: number;
  reference_id: string;
  citizen_name: string;
  citizen_phone: string;
  district_id: number;
  district_name?: string;
  block_id: number;
  block_name?: string;
  panchayat_id: number;
  panchayat_name?: string;
  project_id: number | null;
  project_name?: string;
  project_code?: string;
  category: string;
  description: string;
  photo_url: string | null;
  lat: number;
  lng: number;
  status: 'Submitted' | 'Received' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to_role?: string | null;
  assigned_official_name?: string | null;
  resolution_notes?: string | null;
  feedback_rating?: number | null;
  feedback_comment?: string | null;
  submitted_at: string;
  updated_at: string;
  is_demo: number;
}

export interface ComplaintHistory {
  id: number;
  complaint_id: number;
  previous_status: string;
  new_status: string;
  changed_by_role: string;
  officer_name: string;
  remarks: string;
  timestamp: string;
}

export interface MonitoringAnalysis {
  id: number;
  project_id: number;
  project_name?: string;
  project_code?: string;
  department?: string;
  analysis_type: 'progress_audit' | 'road_condition' | 'greenery_cover';
  title: string;
  before_image_url: string | null;
  after_image_url: string;
  model_estimated_progress_pct: number;
  administrative_reported_pct: number;
  variance_pct: number;
  confidence_score: number;
  potholes_detected: number;
  surface_distress_index: number;
  greenery_coverage_pct: number;
  status: 'verified_consistent' | 'minor_variance' | 'flagged_for_review';
  findings_summary: string;
  inference_mode: 'gemini_vision' | 'deterministic_rule' | 'demo_simulation';
  timestamp: string;
  is_demo: number;
}

export interface Anomaly {
  id: number;
  project_id: number;
  project_name?: string;
  project_code?: string;
  sanctioned_amount?: number;
  recorded_expenditure?: number;
  category: 'budget_overrun' | 'delayed_milestone' | 'expenditure_spike' | 'duplicate_record' | 'missing_documentation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  explanation: string;
  supporting_records: string;
  financial_variance: number;
  detected_at: string;
  review_status: 'open' | 'under_investigation' | 'cleared' | 'escalated';
  suggested_action: string;
  detection_method: 'deterministic_rule' | 'statistical_model';
}

export interface WasteReport {
  id: number;
  reference_id: string;
  location: string;
  district_id: number;
  district_name?: string;
  block_id: number;
  block_name?: string;
  panchayat_id: number;
  panchayat_name?: string;
  lat: number;
  lng: number;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  photo_url: string | null;
  after_photo_url: string | null;
  reported_by: string;
  reported_date: string;
  assigned_department: string;
  assigned_officer: string | null;
  management_status: 'Detected' | 'Reported' | 'Awaiting Review' | 'Verified' | 'Assigned' | 'Collection Scheduled' | 'Work In Progress' | 'Collected' | 'Transported' | 'Processed or Disposed' | 'Verified Resolved' | 'Reopened';
  scheduled_collection_date: string | null;
  actual_collection_date: string | null;
  disposal_method: string | null;
  is_managed: number;
  is_demo: number;
}

export interface PollutionReport {
  id: number;
  reference_id: string;
  location: string;
  district_id: number;
  district_name?: string;
  block_id: number;
  block_name?: string;
  panchayat_id: number;
  panchayat_name?: string;
  lat: number;
  lng: number;
  category: 'Air pollution' | 'Water pollution' | 'Noise pollution' | 'Soil contamination' | 'Industrial emissions' | 'Open waste burning' | 'Sewage discharge';
  aqi: number;
  pm25: number;
  pm10: number;
  reading_unit: string;
  possible_causes: string;
  supporting_evidence: string;
  confidence_level: 'High' | 'Moderate' | 'Investigative Hypothesis';
  status: 'Reported' | 'Under Review' | 'Inspection Assigned' | 'Inspection Completed' | 'Corrective Action Required' | 'Improvement Observed' | 'Resolved and Verified';
  recorded_date: string;
  data_source: string;
  is_demo: number;
}

export interface School {
  id: number;
  code: string;
  name: string;
  category: string;
  district_id: number;
  district_name?: string;
  block_id: number;
  block_name?: string;
  panchayat_id: number;
  panchayat_name?: string;
  address: string;
  managing_authority: string;
  contact_person: string;
  status: 'Good' | 'Minor Maintenance Required' | 'Major Maintenance Required' | 'Safety Issue Under Review' | 'Repair Completed, Verification Pending' | 'Update Overdue';
  last_inspection_date: string;
  is_demo: number;
}

export interface SchoolMaintenanceReport {
  id: number;
  school_id: number;
  school_name?: string;
  reporting_week: string;
  week_start_date: string;
  week_end_date: string;
  building_condition: string;
  classrooms_condition: string;
  toilets_sanitation: string;
  drinking_water: string;
  electricity_power: string;
  desks_furniture: string;
  fire_safety: string;
  repairs_completed: string;
  repairs_pending: string;
  maintenance_expenditure: number;
  inspection_date: string;
  reporting_officer: string;
  verification_status: 'Verified' | 'Pending Review' | 'Overdue';
  notes: string;
  is_demo: number;
}

export interface Hospital {
  id: number;
  code: string;
  name: string;
  facility_type: 'Primary Health Centre (PHC)' | 'Community Health Centre (CHC)' | 'Sub-Divisional Civil Hospital' | 'District Hospital';
  district_id: number;
  district_name?: string;
  block_id: number;
  block_name?: string;
  panchayat_id: number;
  panchayat_name?: string;
  address: string;
  managing_authority: string;
  status: 'Good' | 'Minor Maintenance Required' | 'Major Maintenance Required' | 'Critical Facility Issue Under Review' | 'Maintenance In Progress' | 'Weekly Update Overdue';
  last_inspection_date: string;
  is_demo: number;
}

export interface HospitalMaintenanceReport {
  id: number;
  hospital_id: number;
  hospital_name?: string;
  reporting_week: string;
  week_start_date: string;
  week_end_date: string;
  building_cleanliness: string;
  safe_water: string;
  electricity_backup_power: string;
  toilets_sanitation: string;
  biomedical_waste_segregation: string;
  fire_safety_exits: string;
  essential_equipment_status: string;
  repairs_completed: string;
  repairs_pending: string;
  maintenance_expenditure: number;
  inspection_date: string;
  reporting_officer: string;
  verification_status: 'Verified' | 'Pending Review' | 'Overdue';
  notes: string;
  is_demo: number;
}

export interface DevelopmentNeed {
  id: number;
  title: string;
  category: string;
  description: string;
  district_id: number;
  district_name?: string;
  block_id: number;
  block_name?: string;
  panchayat_id: number;
  panchayat_name?: string;
  lat: number;
  lng: number;
  citizen_name: string;
  citizen_phone: string;
  supporting_residents_count: number;
  priority_score: number;
  status: 'Registered' | 'Under Department Review' | 'Included in GPDP Plan' | 'Sanctioned';
  submitted_at: string;
  is_demo: number;
}

export interface AnalyticsData {
  summary: {
    total_projects: number;
    total_sanctioned: number;
    total_released: number;
    total_spent: number;
    total_remaining: number;
    avg_progress_pct: number;
    completeness_score: number;
  };
  status_distribution: Array<{ status: string; count: number; total_sanctioned: number }>;
  district_allocations: Array<{
    id: number;
    district_name: string;
    project_count: number;
    sanctioned: number;
    released: number;
    spent: number;
  }>;
  department_allocations: Array<{
    department: string;
    count: number;
    sanctioned: number;
    spent: number;
  }>;
  delayed_projects: Project[];
  completeness: {
    total_records: number;
    verified_records: number;
    with_contractor_gst: number;
    with_geo_coordinates: number;
    with_source_url: number;
  };
}

