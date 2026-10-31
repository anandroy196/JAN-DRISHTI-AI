# JanDrishti AI — Deployment & Operating Guide

## 1. Architecture Overview

JanDrishti AI is architected for dual-mode deployment:

1. **Unified Full-Stack Mode (Default AI Studio & Single-Instance)**:
   - Node.js Express server (`server.ts`) running on port 3000.
   - Built-in persistent SQLite database (`jandrishti.db`) using native `node:sqlite`.
   - Bundled Vite frontend served through Express middleware in development or `/dist` in production.
   - Zero external infrastructure dependency for immediate local execution and hackathon judging.

2. **Decoupled Multi-Tier Mode (Production Cloud / Render)**:
   - **Frontend**: Vite React SPA hosted on Render Static Site or Vercel.
   - **Backend**: FastAPI Python application located in `/backend` running via `uvicorn backend.main:app`.
   - **Database**: Managed PostgreSQL on Render or persistent SQLite volume.
   - Configuration supplied in `render.yaml`.

---

## 2. Local Development

### Option A: Unified Full-Stack (Recommended)
```bash
npm install
npm run dev
# Server runs at http://localhost:3000 with unified API and React UI
```

### Option B: FastAPI Backend + Vite Frontend
```bash
# Terminal 1 - Backend
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000

# Terminal 2 - Frontend
npm install
npm run dev -- --port 5173
```

---

## 3. Render Deployment Steps

1. Push your repository to GitHub.
2. Sign in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Select your JanDrishti AI repository.
5. Render will detect `render.yaml` and configure:
   - `jandrishti-db`: PostgreSQL database
   - `jandrishti-api`: Python FastAPI service
   - `jandrishti-web`: Static web app pointing to `jandrishti-api`
6. Click **Apply**.


---

## Notes (latest fixes)

- `npm start` now runs `tsx server.ts` in production mode (run `npm run build` first). Port comes from `PORT` (default 3000).
- `GEMINI_API_KEY` is optional. Without it (or with the placeholder value) the app uses its deterministic offline fallback.
- `jandrishti.db` is created and seeded automatically on first run. Delete it to reset all demo data.
- Demo logins: usernames `citizen`, `official`, `admin`, `superadmin` (no password needed). Newly registered citizens must use their phone number + password.
