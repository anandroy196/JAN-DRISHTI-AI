import { District, Block, Panchayat, Project, Complaint, MonitoringAnalysis, Anomaly, AnalyticsData, UserProfile } from './types';

const BASE_URL = '/api';

async function errorFrom(res: Response, fallback: string): Promise<Error> {
  try {
    const body = await res.json();
    return new Error(body?.error || body?.message || fallback);
  } catch {
    return new Error(fallback);
  }
}


export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}

export async function fetchDistricts(): Promise<District[]> {
  const res = await fetch(`${BASE_URL}/districts`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch districts');
  return res.json();
}

export async function fetchBlocks(districtId?: number): Promise<Block[]> {
  const url = districtId ? `${BASE_URL}/blocks?district_id=${districtId}` : `${BASE_URL}/blocks`;
  const res = await fetch(url);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch blocks');
  return res.json();
}

export async function fetchPanchayats(blockId?: number): Promise<Panchayat[]> {
  const url = blockId ? `${BASE_URL}/panchayats?block_id=${blockId}` : `${BASE_URL}/panchayats`;
  const res = await fetch(url);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch panchayats');
  return res.json();
}

export async function fetchProjects(params?: {
  district_id?: number;
  block_id?: number;
  panchayat_id?: number;
  status?: string;
  department?: string;
  search?: string;
}): Promise<Project[]> {
  const searchParams = new URLSearchParams();
  if (params?.district_id) searchParams.append('district_id', String(params.district_id));
  if (params?.block_id) searchParams.append('block_id', String(params.block_id));
  if (params?.panchayat_id) searchParams.append('panchayat_id', String(params.panchayat_id));
  if (params?.status) searchParams.append('status', params.status);
  if (params?.department) searchParams.append('department', params.department);
  if (params?.search) searchParams.append('search', params.search);

  const res = await fetch(`${BASE_URL}/projects?${searchParams.toString()}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch projects');
  return res.json();
}

export async function fetchProjectDetail(id: number) {
  const res = await fetch(`${BASE_URL}/projects/${id}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch project detail');
  return res.json();
}

export async function createProject(payload: Partial<Project>) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create project');
  }
  return res.json();
}

export async function updateProjectMilestone(id: number, payload: {
  reported_progress_pct?: number;
  recorded_expenditure?: number;
  status?: string;
  note?: string;
}) {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to update project milestone');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${BASE_URL}/analytics`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch analytics');
  return res.json();
}

export async function fetchComplaints(params?: {
  status?: string;
  category?: string;
  district_id?: number;
  search?: string;
}): Promise<Complaint[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append('status', params.status);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.district_id) searchParams.append('district_id', String(params.district_id));
  if (params?.search) searchParams.append('search', params.search);

  const res = await fetch(`${BASE_URL}/complaints?${searchParams.toString()}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch complaints');
  return res.json();
}

export async function fetchMyComplaints(params?: {
  phone?: string;
  status?: string;
  search?: string;
}): Promise<Complaint[]> {
  const searchParams = new URLSearchParams();
  if (params?.phone) searchParams.append('phone', params.phone);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);

  const headers: Record<string, string> = {};
  if (params?.phone) {
    headers['x-user-phone'] = params.phone;
  }

  const res = await fetch(`${BASE_URL}/complaints/my?${searchParams.toString()}`, { headers });
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch your complaints');
  return res.json();
}

export async function fetchComplaintDetail(identifier: string) {
  const res = await fetch(`${BASE_URL}/complaints/${encodeURIComponent(identifier)}`);
  if (!res.ok) throw await errorFrom(res, 'Complaint not found');
  return res.json();
}

export async function submitComplaint(payload: {
  citizen_name: string;
  citizen_phone: string;
  district_id: number;
  block_id?: number;
  panchayat_id?: number;
  project_id?: number | null;
  category: string;
  description: string;
  photo_url?: string | null;
  lat?: number;
  lng?: number;
  priority?: string;
}) {
  const res = await fetch(`${BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit complaint');
  }
  return res.json();
}

export async function updateComplaintStatus(id: number, payload: {
  new_status: string;
  officer_name?: string;
  officer_role?: string;
  remarks?: string;
  resolution_notes?: string;
}) {
  const res = await fetch(`${BASE_URL}/complaints/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to update status');
  return res.json();
}

export async function submitComplaintFeedback(id: number, rating: number, comment?: string) {
  const res = await fetch(`${BASE_URL}/complaints/${id}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment })
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to submit feedback');
  return res.json();
}

export async function fetchMonitoring(): Promise<MonitoringAnalysis[]> {
  const res = await fetch(`${BASE_URL}/monitoring`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch monitoring');
  return res.json();
}

export async function analyzeProgress(payload: {
  project_id: number;
  before_image?: string;
  after_image: string;
  notes?: string;
}) {
  const res = await fetch(`${BASE_URL}/monitoring/analyze-progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Progress analysis failed');
  return res.json();
}

export async function analyzeRoad(payload: {
  project_id?: number;
  road_name?: string;
  image_url?: string;
  location_note?: string;
}) {
  const res = await fetch(`${BASE_URL}/monitoring/analyze-road`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Road inspection failed');
  return res.json();
}

export async function analyzeGreenery(payload: {
  project_id?: number;
  location_title?: string;
  image_url?: string;
}) {
  const res = await fetch(`${BASE_URL}/monitoring/analyze-greenery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Greenery inspection failed');
  return res.json();
}

export async function fetchAnomalies(): Promise<Anomaly[]> {
  const res = await fetch(`${BASE_URL}/anomalies`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch anomalies');
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${BASE_URL}/audit-logs`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch audit logs');
  return res.json();
}

export async function queryAssistant(question: string, language: string = 'en') {
  const res = await fetch(`${BASE_URL}/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language })
  });
  if (!res.ok) throw await errorFrom(res, 'Assistant query failed');
  return res.json();
}

export async function loginRole(role: string, username?: string, password?: string): Promise<{ success: boolean; user: UserProfile; token: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, username, password })
  });
  if (!res.ok) throw await errorFrom(res, 'Login failed');
  return res.json();
}

export async function registerCitizen(payload: {
  full_name: string;
  phone: string;
  email?: string;
  password?: string;
  state?: string;
  district?: string;
  locality?: string;
  preferred_language?: string;
}): Promise<{ success: boolean; user: UserProfile; token: string }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Registration failed');
  }
  return res.json();
}

export async function verifyOtp(phone: string, otp: string) {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'OTP verification failed');
  }
  return res.json();
}

export async function forgotPassword(phone: string) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return res.json();
}

// Waste Management API
export async function fetchWasteReports(params?: {
  district_id?: number;
  status?: string;
  severity?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.district_id) searchParams.append('district_id', String(params.district_id));
  if (params?.status) searchParams.append('status', params.status);
  if (params?.severity) searchParams.append('severity', params.severity);
  if (params?.search) searchParams.append('search', params.search);

  const res = await fetch(`${BASE_URL}/waste?${searchParams.toString()}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch waste reports');
  return res.json();
}

export async function submitWasteReport(payload: any) {
  const res = await fetch(`${BASE_URL}/waste`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to submit waste report');
  return res.json();
}

export async function updateWasteStatus(id: number, payload: any) {
  const res = await fetch(`${BASE_URL}/waste/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to update waste status');
  return res.json();
}

// Pollution API
export async function fetchPollutionReports(params?: { district_id?: number; category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.district_id) searchParams.append('district_id', String(params.district_id));
  if (params?.category) searchParams.append('category', params.category);

  const res = await fetch(`${BASE_URL}/pollution?${searchParams.toString()}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch pollution reports');
  return res.json();
}

export async function submitPollutionReport(payload: any) {
  const res = await fetch(`${BASE_URL}/pollution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to record pollution report');
  return res.json();
}

export async function analyzePollutionCause(payload: { category: string; aqi?: number; location?: string }) {
  const res = await fetch(`${BASE_URL}/pollution/analyze-cause`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Cause analysis failed');
  return res.json();
}

// Schools API
export async function fetchSchools(params?: { district_id?: number; status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.district_id) searchParams.append('district_id', String(params.district_id));
  if (params?.status) searchParams.append('status', params.status);

  const res = await fetch(`${BASE_URL}/schools?${searchParams.toString()}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch schools');
  return res.json();
}

export async function fetchSchoolDetail(id: number) {
  const res = await fetch(`${BASE_URL}/schools/${id}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch school details');
  return res.json();
}

export async function submitSchoolReport(schoolId: number, payload: any) {
  const res = await fetch(`${BASE_URL}/schools/${schoolId}/maintenance-reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to submit school report');
  return res.json();
}

// Hospitals API
export async function fetchHospitals(params?: { district_id?: number; status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.district_id) searchParams.append('district_id', String(params.district_id));
  if (params?.status) searchParams.append('status', params.status);

  const res = await fetch(`${BASE_URL}/hospitals?${searchParams.toString()}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch hospitals');
  return res.json();
}

export async function fetchHospitalDetail(id: number) {
  const res = await fetch(`${BASE_URL}/hospitals/${id}`);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch hospital details');
  return res.json();
}

export async function submitHospitalReport(hospitalId: number, payload: any) {
  const res = await fetch(`${BASE_URL}/hospitals/${hospitalId}/maintenance-reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to submit hospital report');
  return res.json();
}

// Development Needs API
export async function fetchDevelopmentNeeds(districtId?: number) {
  const url = districtId ? `${BASE_URL}/development-needs?district_id=${districtId}` : `${BASE_URL}/development-needs`;
  const res = await fetch(url);
  if (!res.ok) throw await errorFrom(res, 'Failed to fetch development needs');
  return res.json();
}

export async function submitDevelopmentNeed(payload: any) {
  const res = await fetch(`${BASE_URL}/development-needs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to register development need');
  return res.json();
}

export async function upvoteDevelopmentNeed(id: number) {
  const res = await fetch(`${BASE_URL}/development-needs/${id}/upvote`, {
    method: 'POST'
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to endorse development need');
  return res.json();
}

