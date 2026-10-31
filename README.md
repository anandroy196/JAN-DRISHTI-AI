# JanDrishti AI — Every Rupee Accountable. Every Citizen Empowered.

**Hero Headline:** Your Voice. Your Village. Your Development.  
**Platform Type:** AI-Powered Civic Governance, Public Expenditure Transparency, Rural Development Monitoring, and Citizen Participation Platform.

---

## 1. System Architecture & Capabilities

JanDrishti AI is designed for national-scale civic accountability and hackathon presentation with dual-deployment capabilities:

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + Leaflet (OpenStreetMap) + Lucide Icons + Motion.
- **Unified Full-Stack Engine**: Node.js 22 + Express + Native Persistent SQLite (`jandrishti.db`) running on port 3000.
- **Python / FastAPI Tier**: Complete SQLAlchemy database models, REST routers, and migration schemas in `/backend` for Render / PostgreSQL deployment.
- **AI Vision & Audit Pipeline**:
  - Comparative photographic slider (before baseline vs milestone progress snapshot).
  - Physical vs financial variance computation with automatic statutory audit flag thresholds (>15%).
  - Road distress and pothole detection with Surface Distress Index (SDI) scoring.
  - NDVI vegetative canopy density calculation for rural MGNREGA afforestation compliance.
  - Explainable financial anomaly engine scanning vouchers and delay patterns without speculative bias.
- **Citizen Grievance Lifecycle**:
  - Alphanumeric reference generator (e.g. `JD-2026-8812`).
  - GPS-referenced photo submission.
  - Multi-tier lifecycle: `Submitted` → `Received` → `Under Review` → `Assigned` → `In Progress` → `Resolved` / `Rejected`.
  - Full cryptographic-style timestamped audit trail and citizen feedback ratings.
- **Multilingual Assistant**:
  - Speech-enabled voice input and text queries in English, Hindi (हिंदी), and Punjabi (ਪੰਜਾਬੀ).
  - Grounded in real authorized database records (no hallucinated budgets or fictitious officials).
- **Role-Based Access Control (4 Personas)**:
  1. *Citizen / Resident*: Search public fund ledger, view project photographs, log geo-tagged grievances, rate resolved works.
  2. *Government Official (Executive Engineer)*: Record milestone physical progress, submit contractor expenditure vouchers, review assigned grievances.
  3. *District / Block Administrator*: Review inter-block expenditure, monitor delay registries, summon contractors, escalate anomaly alerts.
  4. *State Mission Director / System Admin*: System audit logs, cryptographic transaction verification, integration endpoints.

---

## 2. 10-Step National Hackathon Demonstration Flow

JanDrishti includes a dedicated guided demonstration modal accessible from the top banner:
1. **Sanction Approval**: Central & State share allocation (PMGSY, Jal Jeevan Mission, RGSA).
2. **Administrative Hierarchy**: District → Block → Gram Panchayat traceability.
3. **Contractor Profile**: Verified GSTIN, tender values, and disbursed vouchers.
4. **Site Photo & Voucher**: Baseline ground conditions vs milestone field claim.
5. **AI Vision Audit**: Automated detection of physical progress lag (-21% variance).
6. **Citizen Grievance**: Geo-tagged public report filed by resident with photo.
7. **Ticket Routing**: Real-time dispatch to the responsible Executive Engineer.
8. **Official Review**: Officer actions, contractor notice, and status transition.
9. **Citizen Tracking**: Live public transparency timeline with timestamped officer remarks.
10. **Transparency Audit**: Generation and printing of the official Project Social Audit Ledger.

---

## 3. Quick Start & Local Execution

```bash
# Install dependencies
npm install

# Start Unified Full-Stack Application (Port 3000)
npm run dev

# Open in Browser
http://localhost:3000
```

### Python FastAPI Mode
```bash
# Setup virtual environment
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Run FastAPI backend (Port 8000)
uvicorn backend.main:app --reload --port 8000
```

---

## 4. API Endpoints

- `GET /api/health` — System and database health status
- `GET /api/districts` — District list with budget totals
- `GET /api/blocks?district_id=` — Block level hierarchy
- `GET /api/panchayats?block_id=` — Gram Panchayat list with GPS coordinates
- `GET /api/projects` — Filterable project registry
- `GET /api/projects/:id` — Full project particulars, vouchers, grievances, and audits
- `POST /api/projects` — Create sanctioned project (Official/Admin)
- `PATCH /api/projects/:id` — Update progress milestone & expenditure
- `GET /api/analytics` — Statistical allocations, delay queue, and completeness metrics
- `GET /api/complaints` — Filterable citizen complaints
- `POST /api/complaints` — Submit grievance and receive real reference ID
- `GET /api/complaints/:id` — Detailed ticket timeline and officer actions
- `PATCH /api/complaints/:id/status` — Official workflow progression
- `POST /api/complaints/:id/feedback` — Citizen resolution rating
- `GET /api/monitoring` — AI vision inspections ledger
- `POST /api/monitoring/analyze-progress` — Vision before/after progress discrepancy check
- `POST /api/monitoring/analyze-road` — Road pothole & surface distress index scan
- `POST /api/monitoring/analyze-greenery` — Vegetative canopy & NDVI estimation
- `GET /api/anomalies` — Explainable financial anomaly alerts
- `POST /api/assistant` — Multilingual query assistant (EN / HI / PA)
- `POST /api/auth/login` — Role persona switching

---

## 5. Demonstration Disclaimer

All fictional records in this demonstration cluster are clearly marked:
`DEMO DATA — NOT OFFICIAL GOVERNMENT RECORDS`.
The application does not claim official government endorsement unless formally authorized by state or central ministries.
