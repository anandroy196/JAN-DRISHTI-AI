import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve(process.cwd(), 'jandrishti.db');

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
  is_confidential?: number;
  assigned_to_role: string | null;
  assigned_official_name: string | null;
  resolution_notes: string | null;
  feedback_rating: number | null;
  feedback_comment: string | null;
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

export interface AuditLog {
  id: number;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS districts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      total_sanctioned REAL DEFAULT 0,
      total_released REAL DEFAULT 0,
      total_spent REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      district_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      FOREIGN KEY(district_id) REFERENCES districts(id)
    );

    CREATE TABLE IF NOT EXISTS panchayats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      block_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      population INTEGER DEFAULT 2000,
      FOREIGN KEY(block_id) REFERENCES blocks(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      district_id INTEGER NOT NULL,
      block_id INTEGER NOT NULL,
      panchayat_id INTEGER NOT NULL,
      department TEXT NOT NULL,
      scheme TEXT NOT NULL,
      contractor_name TEXT NOT NULL,
      contractor_id TEXT NOT NULL,
      sanctioned_amount REAL NOT NULL,
      released_amount REAL NOT NULL,
      paid_to_contractor REAL NOT NULL,
      recorded_expenditure REAL NOT NULL,
      start_date TEXT NOT NULL,
      expected_completion TEXT NOT NULL,
      actual_completion TEXT,
      reported_progress_pct REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      official_source_url TEXT NOT NULL,
      source_name TEXT NOT NULL,
      data_retrieval_date TEXT NOT NULL,
      verification_status TEXT NOT NULL DEFAULT 'verified',
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      description TEXT NOT NULL,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(district_id) REFERENCES districts(id),
      FOREIGN KEY(block_id) REFERENCES blocks(id),
      FOREIGN KEY(panchayat_id) REFERENCES panchayats(id)
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_id TEXT UNIQUE NOT NULL,
      citizen_name TEXT NOT NULL,
      citizen_phone TEXT NOT NULL,
      district_id INTEGER NOT NULL,
      block_id INTEGER NOT NULL,
      panchayat_id INTEGER NOT NULL,
      project_id INTEGER,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      photo_url TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Submitted',
      priority TEXT NOT NULL DEFAULT 'medium',
      is_confidential INTEGER DEFAULT 0,
      assigned_to_role TEXT,
      assigned_official_name TEXT,
      resolution_notes TEXT,
      feedback_rating INTEGER,
      feedback_comment TEXT,
      submitted_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(district_id) REFERENCES districts(id),
      FOREIGN KEY(block_id) REFERENCES blocks(id),
      FOREIGN KEY(panchayat_id) REFERENCES panchayats(id)
    );

    CREATE TABLE IF NOT EXISTS complaint_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id INTEGER NOT NULL,
      previous_status TEXT NOT NULL,
      new_status TEXT NOT NULL,
      changed_by_role TEXT NOT NULL,
      officer_name TEXT NOT NULL,
      remarks TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY(complaint_id) REFERENCES complaints(id)
    );

    CREATE TABLE IF NOT EXISTS monitoring_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      analysis_type TEXT NOT NULL,
      title TEXT NOT NULL,
      before_image_url TEXT,
      after_image_url TEXT NOT NULL,
      model_estimated_progress_pct REAL DEFAULT 0,
      administrative_reported_pct REAL DEFAULT 0,
      variance_pct REAL DEFAULT 0,
      confidence_score REAL DEFAULT 0.85,
      potholes_detected INTEGER DEFAULT 0,
      surface_distress_index REAL DEFAULT 0,
      greenery_coverage_pct REAL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'verified_consistent',
      findings_summary TEXT NOT NULL,
      inference_mode TEXT NOT NULL DEFAULT 'demo_simulation',
      timestamp TEXT NOT NULL,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS anomalies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      explanation TEXT NOT NULL,
      supporting_records TEXT NOT NULL,
      financial_variance REAL DEFAULT 0,
      detected_at TEXT NOT NULL,
      review_status TEXT NOT NULL DEFAULT 'open',
      suggested_action TEXT NOT NULL,
      detection_method TEXT NOT NULL DEFAULT 'deterministic_rule',
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS waste_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_id TEXT UNIQUE NOT NULL,
      location TEXT NOT NULL,
      district_id INTEGER NOT NULL,
      block_id INTEGER NOT NULL,
      panchayat_id INTEGER NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      category TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'medium',
      description TEXT NOT NULL,
      photo_url TEXT,
      after_photo_url TEXT,
      reported_by TEXT NOT NULL,
      reported_date TEXT NOT NULL,
      assigned_department TEXT NOT NULL,
      assigned_officer TEXT,
      management_status TEXT NOT NULL DEFAULT 'Reported',
      scheduled_collection_date TEXT,
      actual_collection_date TEXT,
      disposal_method TEXT,
      is_managed INTEGER DEFAULT 0,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(district_id) REFERENCES districts(id),
      FOREIGN KEY(block_id) REFERENCES blocks(id),
      FOREIGN KEY(panchayat_id) REFERENCES panchayats(id)
    );

    CREATE TABLE IF NOT EXISTS pollution_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_id TEXT UNIQUE NOT NULL,
      location TEXT NOT NULL,
      district_id INTEGER NOT NULL,
      block_id INTEGER NOT NULL,
      panchayat_id INTEGER NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      category TEXT NOT NULL,
      aqi INTEGER DEFAULT 140,
      pm25 REAL DEFAULT 48.5,
      pm10 REAL DEFAULT 95.0,
      reading_unit TEXT DEFAULT 'µg/m³',
      possible_causes TEXT NOT NULL,
      supporting_evidence TEXT NOT NULL,
      confidence_level TEXT NOT NULL DEFAULT 'Moderate',
      status TEXT NOT NULL DEFAULT 'Reported',
      recorded_date TEXT NOT NULL,
      data_source TEXT NOT NULL,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(district_id) REFERENCES districts(id)
    );

    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      district_id INTEGER NOT NULL,
      block_id INTEGER NOT NULL,
      panchayat_id INTEGER NOT NULL,
      address TEXT NOT NULL,
      managing_authority TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Good',
      last_inspection_date TEXT NOT NULL,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(district_id) REFERENCES districts(id)
    );

    CREATE TABLE IF NOT EXISTS school_maintenance_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      school_id INTEGER NOT NULL,
      reporting_week TEXT NOT NULL,
      week_start_date TEXT NOT NULL,
      week_end_date TEXT NOT NULL,
      building_condition TEXT NOT NULL,
      classrooms_condition TEXT NOT NULL,
      toilets_sanitation TEXT NOT NULL,
      drinking_water TEXT NOT NULL,
      electricity_power TEXT NOT NULL,
      desks_furniture TEXT NOT NULL,
      fire_safety TEXT NOT NULL,
      repairs_completed TEXT,
      repairs_pending TEXT,
      maintenance_expenditure REAL DEFAULT 0,
      inspection_date TEXT NOT NULL,
      reporting_officer TEXT NOT NULL,
      verification_status TEXT NOT NULL DEFAULT 'Verified',
      notes TEXT,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(school_id) REFERENCES schools(id)
    );

    CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      facility_type TEXT NOT NULL,
      district_id INTEGER NOT NULL,
      block_id INTEGER NOT NULL,
      panchayat_id INTEGER NOT NULL,
      address TEXT NOT NULL,
      managing_authority TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Good',
      last_inspection_date TEXT NOT NULL,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(district_id) REFERENCES districts(id)
    );

    CREATE TABLE IF NOT EXISTS hospital_maintenance_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hospital_id INTEGER NOT NULL,
      reporting_week TEXT NOT NULL,
      week_start_date TEXT NOT NULL,
      week_end_date TEXT NOT NULL,
      building_cleanliness TEXT NOT NULL,
      safe_water TEXT NOT NULL,
      electricity_backup_power TEXT NOT NULL,
      toilets_sanitation TEXT NOT NULL,
      biomedical_waste_segregation TEXT NOT NULL,
      fire_safety_exits TEXT NOT NULL,
      essential_equipment_status TEXT NOT NULL,
      repairs_completed TEXT,
      repairs_pending TEXT,
      maintenance_expenditure REAL DEFAULT 0,
      inspection_date TEXT NOT NULL,
      reporting_officer TEXT NOT NULL,
      verification_status TEXT NOT NULL DEFAULT 'Verified',
      notes TEXT,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(hospital_id) REFERENCES hospitals(id)
    );

    CREATE TABLE IF NOT EXISTS development_needs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      district_id INTEGER NOT NULL,
      block_id INTEGER NOT NULL,
      panchayat_id INTEGER NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      citizen_name TEXT NOT NULL,
      citizen_phone TEXT NOT NULL,
      supporting_residents_count INTEGER DEFAULT 1,
      priority_score INTEGER DEFAULT 50,
      status TEXT NOT NULL DEFAULT 'Registered',
      submitted_at TEXT NOT NULL,
      is_demo INTEGER DEFAULT 1,
      FOREIGN KEY(district_id) REFERENCES districts(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      details TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL,
      designation TEXT,
      department TEXT,
      assigned_district_id INTEGER,
      state TEXT DEFAULT 'Punjab',
      district TEXT,
      locality TEXT
    );
  `);

  // Run safe schema migrations for existing database columns
  try { db.exec(`ALTER TABLE users ADD COLUMN phone TEXT`); } catch {}
  // Backfill phone numbers for demo personas created before the phone column existed
  try {
    db.exec(`
      UPDATE users SET phone = '+91 98721 00001' WHERE username = 'citizen' AND (phone IS NULL OR phone = '');
      UPDATE users SET phone = '+91 98721 00002' WHERE username = 'official' AND (phone IS NULL OR phone = '');
      UPDATE users SET phone = '+91 98721 00003' WHERE username = 'admin' AND (phone IS NULL OR phone = '');
      UPDATE users SET phone = '+91 98721 00004' WHERE username = 'superadmin' AND (phone IS NULL OR phone = '');
    `);
  } catch {}
  try { db.exec(`ALTER TABLE users ADD COLUMN state TEXT DEFAULT 'Punjab'`); } catch {}
  try { db.exec(`ALTER TABLE users ADD COLUMN district TEXT`); } catch {}
  try { db.exec(`ALTER TABLE users ADD COLUMN locality TEXT`); } catch {}

  // Check if initial districts exist, if not seed
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM districts');
  const countResult = countStmt.get() as { count: number };
  if (countResult.count === 0) {
    seedDatabase(db);
  } else {
    // Check if new modules like waste_reports need initial seed
    const wasteCount = (db.prepare('SELECT COUNT(*) as c FROM waste_reports').get() as { c: number }).c;
    if (wasteCount === 0) {
      seedExpandedModules(db);
    }
  }
}

function seedDatabase(db: DatabaseSync) {
  // Districts
  const insertDistrict = db.prepare(`
    INSERT INTO districts (id, name, state, code, total_sanctioned, total_released, total_spent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertDistrict.run(1, 'Ludhiana', 'Punjab', 'PB-LUD', 42500000, 36200000, 29800000);
  insertDistrict.run(2, 'Hoshiarpur', 'Punjab', 'PB-HOS', 31800000, 28100000, 24500000);
  insertDistrict.run(3, 'Bathinda', 'Punjab', 'PB-BAT', 38900000, 32400000, 27600000);

  // Blocks
  const insertBlock = db.prepare(`INSERT INTO blocks (id, district_id, name, code) VALUES (?, ?, ?, ?)`);
  insertBlock.run(1, 1, 'Ludhiana-1', 'PB-LUD-B1');
  insertBlock.run(2, 1, 'Khanna', 'PB-LUD-B2');
  insertBlock.run(3, 2, 'Dasuya', 'PB-HOS-B1');
  insertBlock.run(4, 2, 'Garhshankar', 'PB-HOS-B2');
  insertBlock.run(5, 3, 'Talwandi Sabo', 'PB-BAT-B1');

  // Panchayats
  const insertPanchayat = db.prepare(`
    INSERT INTO panchayats (id, block_id, name, code, lat, lng, population)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertPanchayat.run(1, 1, 'Bhaini Sahib', 'GP-BS-01', 30.9524, 75.8621, 3800);
  insertPanchayat.run(2, 1, 'Sahnewal Kalan', 'GP-SK-02', 30.8415, 75.9872, 4200);
  insertPanchayat.run(3, 2, 'Rasulpur', 'GP-RS-03', 30.7051, 76.2184, 2900);
  insertPanchayat.run(4, 2, 'Begowal', 'GP-BG-04', 30.6841, 76.1925, 3100);
  insertPanchayat.run(5, 3, 'Mukerian Rural', 'GP-MR-05', 31.9542, 75.6128, 4900);
  insertPanchayat.run(6, 3, 'Dholbaha', 'GP-DH-06', 31.7321, 75.8941, 2400);
  insertPanchayat.run(7, 4, 'Bora', 'GP-BR-07', 31.2145, 76.1428, 2700);
  insertPanchayat.run(8, 4, 'Mahlis Geelan', 'GP-MG-08', 31.1892, 76.1023, 3300);
  insertPanchayat.run(9, 5, 'Kot Fatta', 'GP-KF-09', 30.1342, 75.0512, 3600);
  insertPanchayat.run(10, 5, 'Maur Charat Singh', 'GP-MC-10', 30.0815, 75.1245, 4100);

  // Projects
  const insertProject = db.prepare(`
    INSERT INTO projects (
      id, code, name, state, district_id, block_id, panchayat_id,
      department, scheme, contractor_name, contractor_id,
      sanctioned_amount, released_amount, paid_to_contractor, recorded_expenditure,
      start_date, expected_completion, actual_completion, reported_progress_pct,
      status, official_source_url, source_name, data_retrieval_date,
      verification_status, lat, lng, description, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `);

  insertProject.run(
    1,
    'JD-PRJ-2025-001',
    'Construction of All-Weather Bitumen Road from Sahnewal to Canal Bridge',
    'Punjab', 1, 1, 2,
    'Public Works Department (Rural Roads)',
    'Pradhan Mantri Gram Sadak Yojana (PMGSY-III)',
    'Singla Infra & Engineering Pvt Ltd', 'GSTIN03AAACS1289P1Z5',
    8500000, 7200000, 6800000, 6800000,
    '2024-11-15', '2025-05-30', null, 85,
    'ongoing', 'https://omms.nic.in/CitizenWeb/ReportProject.aspx?id=PB-LUD-8841', 'PMGSY OMMAS Portal', '2026-10-25',
    'verified', 30.8425, 75.9862,
    '3.8 km standard asphalt connecting Sahnewal village to the canal highway. Includes sub-base compaction, two culverts, and road edge drainage.', 1
  );

  insertProject.run(
    2,
    'JD-PRJ-2025-002',
    'Solar Powered Community Water Storage Tank & Underground Distribution',
    'Punjab', 1, 1, 1,
    'Department of Water Supply & Sanitation',
    'Jal Jeevan Mission (Har Ghar Jal)',
    'Aman Hydrotech Solutions', 'GSTIN03BBJKA9923K1ZT',
    4200000, 4200000, 3950000, 3950000,
    '2024-08-01', '2025-01-15', '2025-01-20', 100,
    'completed', 'https://ejalshakti.gov.in/jjmreport/JJM_Village_Profile.aspx?v=PB0101', 'JJM National Portal', '2026-10-28',
    'verified', 30.9535, 75.8610,
    '50,000 litre elevated RCC reservoir with automated solar chlorination and 4.2 km distribution pipe supplying 340 rural households.', 1
  );

  insertProject.run(
    3,
    'JD-PRJ-2025-003',
    'Construction of Multi-Purpose Gram Panchayat Bhavan & Digital Seva Kendra',
    'Punjab', 2, 3, 5,
    'Department of Rural Development & Panchayats',
    'Rashtriya Gram Swaraj Abhiyan (RGSA)',
    'Malwa Builders & Construction Co.', 'GSTIN03CCBPP4412M1ZY',
    3500000, 2800000, 2600000, 2600000,
    '2025-01-10', '2025-07-31', null, 55,
    'ongoing', 'https://egramswaraj.gov.in/viewActionPlan.do?gp=PB020305', 'e-GramSwaraj Portal', '2026-10-20',
    'verified', 31.9550, 75.6140,
    'Two-storey community hall with solar rooftop, high-speed fibre broadband civic kiosk, public conference room, and barrier-free ramp access.', 1
  );

  insertProject.run(
    4,
    'JD-PRJ-2025-004',
    'Drainage Network & Solid Waste Composting Shed, Dholbaha',
    'Punjab', 2, 3, 6,
    'Department of Rural Development & Panchayats',
    'Swachh Bharat Mission (Gramin) Phase II',
    'Guru Nanak Sanitation Works', 'GSTIN03DDFRT5510R1ZL',
    1800000, 1500000, 950000, 950000,
    '2024-09-01', '2025-03-31', null, 40,
    'delayed', 'https://sbm.gov.in/sbmgdashboard/VillageReport.aspx?code=DH06', 'SBM Gramin Dashboard', '2026-10-22',
    'flagged', 31.7330, 75.8950,
    'Paved covered greywater drains along village main street with segregated waste stabilization soak pits. Delayed due to contractor material hold.', 1
  );

  insertProject.run(
    5,
    'JD-PRJ-2025-005',
    'Sub-Canal Embankment Plantation & Check-Dam Re-excavation',
    'Punjab', 3, 5, 9,
    'Department of Rural Development (Soil Conservation)',
    'MGNREGA Rural Infrastructure & Greenery',
    'Gram Panchayat Kot Fatta Direct Execution', 'GP-KOTFATTA-DIR',
    2100000, 2100000, 1920000, 1920000,
    '2024-10-01', '2025-02-28', '2025-03-05', 100,
    'completed', 'https://nrega.nic.in/Netnrega/WorkDetails.aspx?work_code=PB-BAT-KF-09', 'MGNREGA MIS Portal', '2026-10-26',
    'verified', 30.1350, 75.0525,
    'Plantation of 1,200 native trees (Neem, Shisham, Peepal) along canal perimeter and desiltation of 2.1-hectare village recharge pond.', 1
  );

  insertProject.run(
    6,
    'JD-PRJ-2025-006',
    'Modern Smart Classroom Wing at Government Senior Secondary School',
    'Punjab', 1, 2, 3,
    'Department of School Education',
    'Samagra Shiksha Abhiyan',
    'Dua Infrastructure Consortium', 'GSTIN03EEWQE8831Q1ZK',
    4900000, 3600000, 3400000, 3400000,
    '2025-02-01', '2025-08-15', null, 70,
    'ongoing', 'https://samagrashiksha.education.gov.in/project?id=PB-LUD-SK-03', 'Samagra Shiksha Portal', '2026-10-27',
    'verified', 30.7060, 76.2195,
    'Four ventilated classrooms with digital projectors, science laboratory equipment, rooftop solar grid, and dedicated girl-friendly sanitation blocks.', 1
  );

  insertProject.run(
    7,
    'JD-PRJ-2025-007',
    'Pothole Repair & Bitumen Overlay on Maur Charat Singh Link Road',
    'Punjab', 3, 5, 10,
    'Punjab Mandi Board',
    'Rural Link Roads Development Fund',
    'Bansal Roadways & Infra', 'GSTIN03FFGRT9012N1ZW',
    2900000, 2200000, 1100000, 1100000,
    '2024-12-01', '2025-04-15', null, 35,
    'delayed', 'https://mandiboard.punjab.gov.in/works/PB-BAT-MC-10', 'Punjab Mandi Board Works', '2026-10-24',
    'flagged', 30.0825, 75.1260,
    '2.4 km critical link road between grain mandi and village hub. Heavy surface distress observed with multiple water-filled potholes.', 1
  );

  // Complaints
  const insertComplaint = db.prepare(`
    INSERT INTO complaints (
      id, reference_id, citizen_name, citizen_phone, district_id, block_id, panchayat_id,
      project_id, category, description, photo_url, lat, lng,
      status, priority, is_confidential, assigned_to_role, assigned_official_name, resolution_notes,
      feedback_rating, feedback_comment, submitted_at, updated_at, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `);

  insertComplaint.run(
    1,
    'JD-2026-8812',
    'Harpreet Singh', '+91 98721 00001', 1, 1, 2,
    1, 'Damaged roads',
    'Severe potholes have opened up near the culvert section of Sahnewal canal road after recent rains. Two two-wheelers skidded yesterday. Paving was marked 85% done but this section is broken.',
    '/assets/aistudio/pothole_sample.jpg',
    30.8429, 75.9868,
    'Under Review', 'high', 0, 'Executive Engineer', 'Er. Gurdev Singh (PWD Rural)',
    null, null, null,
    '2026-10-28 09:15:00', '2026-10-29 14:30:00', 1
  );

  insertComplaint.run(
    2,
    'JD-2026-7940',
    'Manjit Kaur', '+91 98150 XXXXX', 2, 3, 6,
    4, 'Drainage and sanitation',
    'Open drain overflow in Ward 4 near the primary school. Stagnant waste water entering residential lane. Contractor left construction midway 3 months ago.',
    null,
    31.7335, 75.8955,
    'In Progress', 'urgent', 0, 'Block Development & Panchayat Officer', 'Sh. Rajesh Kumar (BDPO Dasuya)',
    'Notice issued to contractor on Oct 25. Cleaning excavator deployed, culvert clearing started.',
    null, null,
    '2026-10-22 11:20:00', '2026-10-27 16:45:00', 1
  );

  insertComplaint.run(
    3,
    'JD-2026-6511',
    'Gurinder Pal', '+91 94172 XXXXX', 3, 5, 9,
    5, 'Water supply',
    'Community solar filtration tap pressure is very low in the outer Patti. Requesting inspection of the solar pressure pump inverter.',
    null,
    30.1348, 75.0518,
    'Resolved', 'medium', 0, 'Sub-Divisional Officer', 'Er. Jaspreet Kaur (Water Supply)',
    'Solar panel dust cleaning completed and inverter battery connection tightened. Flow rate restored to 14 L/min.',
    5, 'Very quick resolution by the department. Thank you JanDrishti!',
    '2026-10-15 10:05:00', '2026-10-18 17:00:00', 1
  );

  // Users for 4 roles
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, password_hash, full_name, phone, role, designation, department, assigned_district_id, state, district, locality)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertUser.run(1, 'citizen', 'citizen@jandrishti.org', 'demo_hash_citizen', 'Harpreet Singh', '+91 98721 00001', 'citizen', 'Village Resident & Social Activist', 'Gram Sabha Bhaini Sahib', 1, 'Punjab', 'Ludhiana', 'Bhaini Sahib');
  insertUser.run(2, 'official', 'official@jandrishti.gov.in', 'demo_hash_official', 'Er. Gurdev Singh', '+91 98721 00002', 'official', 'Executive Engineer (Rural Works)', 'Public Works Department', 1, 'Punjab', 'Ludhiana', 'PWD Division 1');
  insertUser.run(3, 'admin', 'admin@jandrishti.gov.in', 'demo_hash_admin', 'Ms. Simranjeet Kaur, IAS', '+91 98721 00003', 'admin', 'Additional Deputy Commissioner (Development)', 'District Administration Ludhiana', 1, 'Punjab', 'Ludhiana', 'Mini Secretariat');
  insertUser.run(4, 'superadmin', 'superadmin@jandrishti.gov.in', 'demo_hash_superadmin', 'Dr. Rajiv Menon', '+91 98721 00004', 'superadmin', 'State Mission Director & Tech Lead', 'Department of Rural Development & PR', null, 'Punjab', 'State HQ', 'State Civil Secretariat');

  seedExpandedModules(db);
}

function seedExpandedModules(db: DatabaseSync) {
  // Waste Reports Seed
  const insertWaste = db.prepare(`
    INSERT INTO waste_reports (
      id, reference_id, location, district_id, block_id, panchayat_id, lat, lng,
      category, severity, description, photo_url, after_photo_url, reported_by, reported_date,
      assigned_department, assigned_officer, management_status, scheduled_collection_date,
      actual_collection_date, disposal_method, is_managed, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  insertWaste.run(
    1, 'WR-2026-101', 'Bhaini Sahib Market Road & Bus Shelter', 1, 1, 1, 30.9528, 75.8625,
    'Overflowing dustbins & single-use plastics', 'high',
    'Open commercial waste dump accumulating outside weekly grain market shed. Stray cattle littering plastic bags.',
    '/assets/waste/market_dump_before.jpg', null, 'Balwinder Singh', '2026-10-27 10:15:00',
    'Panchayat Sanitation Wing & Block Development Office', 'Sh. Avtar Singh (Sanitation Inspector)',
    'Collection Scheduled', '2026-11-02', null, 'Transport to Sahnewal Solid Waste Cluster Compactor', 0, 1
  );

  insertWaste.run(
    2, 'WR-2026-102', 'Dholbaha Canal Siphon Culvert Junction', 2, 3, 6, 31.7325, 75.8945,
    'Construction debris blocking drainage culvert', 'critical',
    'Discarded concrete masonry and brick debris blocking agricultural stormwater siphon channel.',
    '/assets/waste/debris_culvert.jpg', '/assets/waste/debris_cleared.jpg', 'Gurcharan Singh', '2026-10-18 14:30:00',
    'Irrigation & Rural Drainage Wing', 'Er. Narinder Paul (SDE Drainage)',
    'Verified Resolved', '2026-10-20', '2026-10-21', 'Recycled for road embankment sub-base aggregate', 1, 1
  );

  insertWaste.run(
    3, 'WR-2026-103', 'Maur Charat Singh Veterinary Hospital Backyard', 3, 5, 10, 30.0818, 75.1249,
    'Open biomedical and agricultural waste dumping', 'high',
    'Unsegregated packaging and medicine bottles dumped behind veterinary dispensary boundary wall.',
    null, null, 'Paramjit Singh', '2026-10-29 16:45:00',
    'Animal Husbandry & District Pollution Control Board', 'Dr. Harjinder Kalsi (VO)',
    'Work In Progress', '2026-10-31', null, 'Yellow bin incineration protocol at regional medical disposal plant', 0, 1
  );

  // Pollution Reports Seed
  const insertPollution = db.prepare(`
    INSERT INTO pollution_reports (
      id, reference_id, location, district_id, block_id, panchayat_id, lat, lng,
      category, aqi, pm25, pm10, reading_unit, possible_causes, supporting_evidence,
      confidence_level, status, recorded_date, data_source, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `);

  insertPollution.run(
    1, 'POL-2026-001', 'Sahnewal Industrial Corridor Fringe', 1, 1, 2, 30.8432, 75.9880,
    'Air pollution', 186, 68.4, 134.0, 'µg/m³',
    'Diesel freight vehicular transit along GT Road + Small-scale metal electroplating furnace emissions',
    'Continuous Ambient Air Quality Monitoring (CAAQM) sensor node #PB-LUD-S4; High PM2.5 to PM10 ratio indicative of combustion soot.',
    'High', 'Inspection Assigned', '2026-10-30 08:00:00', 'Punjab Pollution Control Board (PPCB) Sensor Grid', 1
  );

  insertPollution.run(
    2, 'POL-2026-002', 'Buddha Nullah Rural Inflow Tributary, Rasulpur', 1, 2, 3, 30.7055, 76.2189,
    'Water pollution', 245, 0, 0, 'BOD mg/L',
    'Untreated dairy farm slurry runoff and untreated textile dye effluents upstream',
    'Dissolved oxygen measured at 1.4 mg/L (Critical). Visible dark chemical coloration reported by Panchayat water testing team.',
    'High', 'Corrective Action Required', '2026-10-28 11:30:00', 'District Environment Committee Water Sample Ledger', 1
  );

  insertPollution.run(
    3, 'POL-2026-003', 'Dasuya Sugar Mill Agricultural Embankment', 2, 3, 5, 31.9548, 75.6135,
    'Industrial emissions', 142, 45.2, 88.0, 'µg/m³',
    'Boiler bagasse fly-ash emissions during crushing season peak',
    'Citizen photo evidence showing particulate soot settling on crop leaves; Chimney scrubber maintenance schedule requested.',
    'Moderate', 'Under Review', '2026-10-25 15:10:00', 'Citizen Monitoring Post & Local Air Station', 1
  );

  // Schools Seed
  const insertSchool = db.prepare(`
    INSERT INTO schools (
      id, code, name, category, district_id, block_id, panchayat_id, address,
      managing_authority, contact_person, status, last_inspection_date, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `);

  insertSchool.run(
    1, 'SCH-PB-LUD-01', 'Government Senior Secondary School, Sahnewal Kalan', 'Senior Secondary (Class 1-12)',
    1, 1, 2, 'Main Canal Highway, Sahnewal Kalan', 'Department of School Education Punjab',
    'Principal Jaswant Singh (+91 98141 XXXXX)', 'Good', '2026-10-28', 1
  );

  insertSchool.run(
    2, 'SCH-PB-HOS-02', 'Government High School, Dholbaha', 'High School (Class 6-10)',
    2, 3, 6, 'Near Gram Panchayat Bhavan, Dholbaha', 'Department of School Education Punjab',
    'Headmistress Surinder Kaur (+91 94172 XXXXX)', 'Minor Maintenance Required', '2026-10-26', 1
  );

  insertSchool.run(
    3, 'SCH-PB-BAT-03', 'Government Primary School, Kot Fatta', 'Primary School (Class 1-5)',
    3, 5, 9, 'Ward 3, Village Kot Fatta', 'District Education Officer (Elementary)',
    'Master Baldev Raj (+91 98882 XXXXX)', 'Major Maintenance Required', '2026-10-22', 1
  );

  // School Maintenance Reports Seed
  const insertSchoolReport = db.prepare(`
    INSERT INTO school_maintenance_reports (
      id, school_id, reporting_week, week_start_date, week_end_date,
      building_condition, classrooms_condition, toilets_sanitation, drinking_water,
      electricity_power, desks_furniture, fire_safety, repairs_completed, repairs_pending,
      maintenance_expenditure, inspection_date, reporting_officer, verification_status, notes, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  insertSchoolReport.run(
    1, 1, '2026-W43', '2026-10-20', '2026-10-26',
    'Sound structural RCC masonry, clean exterior paint', 'All 14 classrooms well-ventilated, smart projectors operational',
    'Functional separate boys and girls toilets with running water and sanitary vending unit',
    'RO water purification plant verified at 120 L/hr capacity',
    'Rooftop solar grid 10kW active, dual inverter battery backup operational',
    'Dual-seater wooden desks adequate for all 420 students',
    '6 fire extinguishers refilled in August 2026, clear emergency exit pathways',
    'Replacement of 3 overhead ceiling fans and water cooler tap washers',
    'Exterior boundary wall plaster touch-up scheduled for winter break',
    18500, '2026-10-28', 'Er. Sukhwinder Singh (Junior Engineer Education Wing)',
    'Verified', 'Satisfies Samagra Shiksha child-friendly standards.', 1
  );

  insertSchoolReport.run(
    2, 2, '2026-W43', '2026-10-20', '2026-10-26',
    'Minor dampness on corridor roof eaves', '8 classrooms clean, 2 require window mesh repair',
    'Staff toilet functional; student washrooms require tap valve replacement',
    'Safe submersible tap water available, chlorine tablet dosing completed',
    'Single-phase connection stable; solar battery needs distilled water topping',
    'Benches adequate; 4 desks require welding reinforcement',
    'Fire buckets with dry sand present; 1 extinguisher service overdue',
    'Drain desiltation along front courtyard',
    'Window pane glass replacement and roof waterproof sealant',
    8200, '2026-10-26', 'Sh. Rajesh Kumar (BDPO Dasuya & Education Inspector)',
    'Verified', 'Routine maintenance grant sanctioned under SMC fund.', 1
  );

  insertSchoolReport.run(
    3, 3, '2026-W43', '2026-10-20', '2026-10-26',
    'Safety hazard: Cracked boundary wall leaning outward near village pond',
    '4 classrooms functional; 1 classroom sealed due to roof plaster flaking',
    'Girl toilet functional; boy urinal drain blocked by silt',
    'Borewell water pump functional but storage tank lid broken',
    'Frequent power trips; main distribution MCB overheats under full load',
    'Shortage of 15 primary student low-height benches',
    'Emergency equipment absent; urgent fire safety installation needed',
    'None completed in current reporting cycle',
    'Immediate boundary wall reconstruction and MCB electrical rewiring',
    0, '2026-10-22', 'Er. Mohan Lal (Sub-Divisional Officer PWD B&R)',
    'Overdue', 'CRITICAL SAFETY NOTICE issued. Priority repair grant requisitioned from DC Bathinda.', 1
  );

  // Hospitals Seed
  const insertHospital = db.prepare(`
    INSERT INTO hospitals (
      id, code, name, facility_type, district_id, block_id, panchayat_id, address,
      managing_authority, status, last_inspection_date, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  insertHospital.run(
    1, 'HSP-PB-LUD-01', 'Community Health Centre (CHC) Sahnewal', 'Community Health Centre (CHC)',
    1, 1, 2, 'Hospital Road, Sahnewal Rural', 'Department of Health & Family Welfare Punjab',
    'Good', '2026-10-27', 1
  );

  insertHospital.run(
    2, 'HSP-PB-HOS-02', 'Primary Health Centre (PHC) Dholbaha', 'Primary Health Centre (PHC)',
    2, 3, 6, 'Near Post Office, Dholbaha Valley', 'District Health Society Hoshiarpur',
    'Minor Maintenance Required', '2026-10-24', 1
  );

  insertHospital.run(
    3, 'HSP-PB-BAT-03', 'Sub-Divisional Civil Hospital, Talwandi Sabo', 'Sub-Divisional Civil Hospital',
    3, 5, 9, 'Raman Road, Talwandi Sabo', 'Punjab Health Systems Corporation (PHSC)',
    'Critical Facility Issue Under Review', '2026-10-29', 1
  );

  // Hospital Maintenance Reports Seed
  const insertHospitalReport = db.prepare(`
    INSERT INTO hospital_maintenance_reports (
      id, hospital_id, reporting_week, week_start_date, week_end_date,
      building_cleanliness, safe_water, electricity_backup_power, toilets_sanitation,
      biomedical_waste_segregation, fire_safety_exits, essential_equipment_status,
      repairs_completed, repairs_pending, maintenance_expenditure, inspection_date,
      reporting_officer, verification_status, notes, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  insertHospitalReport.run(
    1, 1, '2026-W43', '2026-10-20', '2026-10-26',
    'OPD and maternity ward sanitized 3x daily with medical disinfectant',
    'Continuous RO water supply tested for zero coliform count',
    '45 kVA silent diesel generator with automated AMF changeover panel',
    'Patient and staff toilets clean, hot water geysers operational',
    'Strict 4-color coded segregation (Yellow, Red, Blue, White puncture-proof)',
    'Dual emergency exits clear, fire alarm manual call points tested',
    'X-ray unit, auto-analyzer, and baby radiant warmers calibrated',
    'Servicing of autoclave sterilizer and delivery room air curtain replacement',
    'Replacement of UPS batteries in emergency trauma room',
    34500, '2026-10-27', 'Dr. Mandeep Singla (Senior Medical Officer CHC Sahnewal)',
    'Verified', 'Meets National Quality Assurance Standards (NQAS) rural benchmark.', 1
  );

  insertHospitalReport.run(
    2, 2, '2026-W43', '2026-10-20', '2026-10-26',
    'General clinic rooms clean; outdoor porch requires whitewashing',
    'Overhead 2,000L water tank sanitized on Oct 18',
    'Solar hybrid inverter 3kVA powers immunization cold-chain ice-lined refrigerator (ILR)',
    'Staff washroom functional; general public toilet requires plumbing flush handle fix',
    'Biomedical waste collected 2x weekly by authorized Common Bio-medical Waste Treatment Facility (CBWTF)',
    '2 fire extinguishers present in pharmacy and lab',
    'Vaccine ILR deep freezer maintaining steady +3.5°C temperature',
    'Replaced LED tubelights in vaccination dispensary',
    'Procurement of 1 supplemental stretcher and ceiling plaster touch-up',
    11200, '2026-10-24', 'Dr. Jasleen Kaur (Medical Officer I/C PHC Dholbaha)',
    'Verified', 'Vaccine cold chain verified intact.', 1
  );

  insertHospitalReport.run(
    3, 3, '2026-W43', '2026-10-20', '2026-10-26',
    'Emergency ward clean; 2nd floor ward corridor suffering drainage seepage',
    'Main supply pressure low due to pipeline leakage outside ultrasound block',
    'Diesel generator functional but transfer switch solenoid sticking intermittently',
    'ICU washroom clean; ground floor general OPD toilets heavily choked',
    'Bar-coded biomedical bags used; pickup delayed by 48 hours due to contractor vehicle breakdown',
    'Emergency ramp clear; 1 fire hose reel valve leaking water',
    'Centrifuge machine in pathology lab requires sensor motor repair',
    'Temporary repair of ambulance oxygen manifold valve',
    'Major pipeline replacement between pump house and diagnostic block',
    42000, '2026-10-29', 'Er. Harbhajan Singh (Executive Engineer PHSC Civil Wing)',
    'Pending Review', 'Urgent plumber work order issued to resolve diagnostic pipeline leakage.', 1
  );

  // Development Needs Seed
  const insertNeed = db.prepare(`
    INSERT INTO development_needs (
      id, title, category, description, district_id, block_id, panchayat_id,
      lat, lng, citizen_name, citizen_phone, supporting_residents_count, priority_score,
      status, submitted_at, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  insertNeed.run(
    1, 'Paved Link Road for Farmers to Sahnewal Grain Market', 'Roads & Bridges',
    'Construction of 1.4 km concrete feeder road connecting 42 agricultural farms directly to main mandi road.',
    1, 1, 2, 30.8440, 75.9890, 'Amrik Singh (Bhartiya Kisan Union)', '+91 98721 11223', 88, 92,
    'Included in GPDP Plan', '2026-10-15 09:00:00', 1
  );

  insertNeed.run(
    2, 'Solar Powered Street Lighting on High School Girls Commute Route', 'Electricity & Safety',
    'Installation of 18 high-lumen solar LED streetlights along the 1.2 km rural canal approach road.',
    2, 3, 6, 31.7338, 75.8962, 'Kiran Bala (Mahila Mandal President)', '+91 98150 44556', 142, 95,
    'Under Department Review', '2026-10-22 14:15:00', 1
  );

  insertNeed.run(
    3, 'Community Underground Rainwater Harvesting & Pond Revitalization', 'Water Supply & Ecology',
    'Deep desiltation and bio-remediation of 3-acre historic village pond to arrest groundwater depletion.',
    3, 5, 9, 30.1360, 75.0530, 'Jagdev Singh (Sarpanch)', '+91 94172 77889', 215, 88,
    'Sanctioned', '2026-10-10 11:30:00', 1
  );
}
