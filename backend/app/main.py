from fastapi import FastAPI, Depends, HTTPException, Query, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import os
import random
from datetime import datetime

from .database import engine, get_db, Base
from . import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JanDrishti AI Core API",
    description="Backend API for Public Fund Tracking, AI Monitoring, Citizen Grievances, My Complaints, Schools & Hospitals",
    version="2.5.0"
)

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    projects_count = db.query(models.Project).count()
    complaints_count = db.query(models.Complaint).count()
    schools_count = db.query(models.School).count()
    hospitals_count = db.query(models.Hospital).count()
    return {
        "status": "healthy",
        "service": "JanDrishti AI Core Platform (FastAPI)",
        "database": "SQLAlchemy + SQLite / PostgreSQL",
        "projects_count": projects_count,
        "complaints_count": complaints_count,
        "schools_count": schools_count,
        "hospitals_count": hospitals_count,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/districts")
def get_districts(db: Session = Depends(get_db)):
    return db.query(models.District).order_by(models.District.name).all()

@app.get("/api/blocks")
def get_blocks(district_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Block)
    if district_id:
        query = query.filter(models.Block.district_id == district_id)
    return query.order_by(models.Block.name).all()

@app.get("/api/panchayats")
def get_panchayats(block_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Panchayat)
    if block_id:
        query = query.filter(models.Panchayat.block_id == block_id)
    return query.order_by(models.Panchayat.name).all()

@app.get("/api/projects")
def get_projects(
    district_id: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Project)
    if district_id:
        query = query.filter(models.Project.district_id == district_id)
    if status and status != "all":
        query = query.filter(models.Project.status == status)
    if search:
        query = query.filter(models.Project.name.ilike(f"%{search}%"))
    return query.all()

@app.get("/api/projects/{project_id}")
def get_project_detail(project_id: int, db: Session = Depends(get_db)):
    prj = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not prj:
        raise HTTPException(status_code=404, detail="Project not found")
    complaints = db.query(models.Complaint).filter(models.Complaint.project_id == project_id).all()
    anomalies = db.query(models.Anomaly).filter(models.Anomaly.project_id == project_id).all()
    return {
        "project": prj,
        "calculated": {
            "remaining_funds": prj.sanctioned_amount - prj.recorded_expenditure,
            "expenditure_pct": round((prj.recorded_expenditure / prj.sanctioned_amount) * 100) if prj.sanctioned_amount else 0
        },
        "complaints": complaints,
        "anomalies": anomalies
    }

# Complaints Listing
@app.get("/api/complaints")
def get_complaints(
    status: Optional[str] = None,
    district_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Complaint)
    if status and status != "all":
        query = query.filter(models.Complaint.status.ilike(f"%{status}%"))
    if district_id:
        query = query.filter(models.Complaint.district_id == district_id)
    if search:
        query = query.filter(
            (models.Complaint.reference_id.ilike(f"%{search}%")) |
            (models.Complaint.description.ilike(f"%{search}%")) |
            (models.Complaint.citizen_name.ilike(f"%{search}%"))
        )
    return query.order_by(models.Complaint.submitted_at.desc()).all()

# My Complaints Listing (for logged-in citizen)
@app.get("/api/complaints/my")
def get_my_complaints(
    phone: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    x_user_phone: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    user_phone = phone or x_user_phone
    query = db.query(models.Complaint)
    if user_phone:
        last10 = user_phone.replace(" ", "")[-10:]
        query = query.filter(models.Complaint.citizen_phone.ilike(f"%{last10}%"))
    if status and status != "all":
        query = query.filter(models.Complaint.status.ilike(f"%{status}%"))
    if search:
        query = query.filter(
            (models.Complaint.reference_id.ilike(f"%{search}%")) |
            (models.Complaint.description.ilike(f"%{search}%")) |
            (models.Complaint.category.ilike(f"%{search}%"))
        )
    return query.order_by(models.Complaint.submitted_at.desc()).all()

@app.get("/api/complaints/{identifier}")
def get_complaint_detail(identifier: str, db: Session = Depends(get_db)):
    if identifier.isdigit():
        complaint = db.query(models.Complaint).filter(models.Complaint.id == int(identifier)).first()
    else:
        complaint = db.query(models.Complaint).filter(models.Complaint.reference_id == identifier).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    history = db.query(models.ComplaintHistory).filter(models.ComplaintHistory.complaint_id == complaint.id).order_by(models.ComplaintHistory.timestamp.asc()).all()
    return {"complaint": complaint, "history": history}

@app.post("/api/complaints")
def submit_complaint(payload: Dict[str, Any], db: Session = Depends(get_db)):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    rand_suffix = random.randint(1000, 9999)
    ref_id = f"JD-2026-{rand_suffix}"

    cmp = models.Complaint(
        reference_id=ref_id,
        citizen_name=payload.get("citizen_name", "Citizen"),
        citizen_phone=payload.get("citizen_phone", "9814199999"),
        district_id=int(payload.get("district_id", 1)),
        block_id=int(payload.get("block_id", 1)),
        panchayat_id=int(payload.get("panchayat_id", 1)),
        project_id=int(payload.get("project_id")) if payload.get("project_id") else None,
        category=payload.get("category", "General Civic Issue"),
        description=payload.get("description", ""),
        photo_url=payload.get("photo_url"),
        lat=float(payload.get("lat", 30.8425)),
        lng=float(payload.get("lng", 75.9862)),
        status="Received",
        priority=payload.get("priority", "medium"),
        submitted_at=now,
        updated_at=now,
        is_demo=1
    )
    db.add(cmp)
    db.commit()
    db.refresh(cmp)

    # Initial history
    h1 = models.ComplaintHistory(
        complaint_id=cmp.id,
        previous_status="None",
        new_status="Submitted",
        changed_by_role="Citizen",
        officer_name=cmp.citizen_name,
        remarks="Complaint registered through JanDrishti Public Portal",
        timestamp=now
    )
    h2 = models.ComplaintHistory(
        complaint_id=cmp.id,
        previous_status="Submitted",
        new_status="Received",
        changed_by_role="System",
        officer_name="Automated Dispatch Gateway",
        remarks="Ticket categorized and queued for block nodal officer verification",
        timestamp=now
    )
    db.add(h1)
    db.add(h2)
    db.commit()

    return {
        "success": True,
        "complaint_id": cmp.id,
        "reference_id": ref_id,
        "status": "Received",
        "message": "Grievance submitted and persisted successfully."
    }

@app.patch("/api/complaints/{complaint_id}/status")
def update_complaint_status(complaint_id: int, payload: Dict[str, Any], db: Session = Depends(get_db)):
    cmp = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Complaint not found")

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    prev_status = cmp.status
    new_status = payload.get("new_status", prev_status)

    cmp.status = new_status
    if payload.get("resolution_notes"):
        cmp.resolution_notes = payload.get("resolution_notes")
    if payload.get("officer_role"):
        cmp.assigned_to_role = payload.get("officer_role")
    if payload.get("officer_name"):
        cmp.assigned_official_name = payload.get("officer_name")
    cmp.updated_at = now

    hist = models.ComplaintHistory(
        complaint_id=cmp.id,
        previous_status=prev_status,
        new_status=new_status,
        changed_by_role=payload.get("officer_role", "Government Official"),
        officer_name=payload.get("officer_name", "Assigned Officer"),
        remarks=payload.get("remarks", f"Status transitioned from {prev_status} to {new_status}"),
        timestamp=now
    )
    db.add(hist)
    db.commit()
    return {"success": True, "message": f"Status updated to {new_status}"}

@app.post("/api/complaints/{complaint_id}/feedback")
def submit_complaint_feedback(complaint_id: int, payload: Dict[str, Any], db: Session = Depends(get_db)):
    cmp = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Complaint not found")
    cmp.feedback_rating = int(payload.get("rating", 5))
    cmp.feedback_comment = payload.get("comment", "")
    db.commit()
    return {"success": True, "message": "Feedback recorded."}

@app.get("/api/schools")
def get_schools(district_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.School)
    if district_id:
        query = query.filter(models.School.district_id == district_id)
    if status and status != "All":
        query = query.filter(models.School.status == status)
    return query.all()

@app.get("/api/schools/{school_id}")
def get_school_detail(school_id: int, db: Session = Depends(get_db)):
    school = db.query(models.School).filter(models.School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    reports = db.query(models.SchoolMaintenanceReport).filter(models.SchoolMaintenanceReport.school_id == school_id).order_by(models.SchoolMaintenanceReport.inspection_date.desc()).all()
    return {"school": school, "maintenance_reports": reports}

@app.get("/api/hospitals")
def get_hospitals(district_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Hospital)
    if district_id:
        query = query.filter(models.Hospital.district_id == district_id)
    if status and status != "All":
        query = query.filter(models.Hospital.status == status)
    return query.all()

@app.get("/api/hospitals/{hospital_id}")
def get_hospital_detail(hospital_id: int, db: Session = Depends(get_db)):
    hospital = db.query(models.Hospital).filter(models.Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    reports = db.query(models.HospitalMaintenanceReport).filter(models.HospitalMaintenanceReport.hospital_id == hospital_id).order_by(models.HospitalMaintenanceReport.inspection_date.desc()).all()
    return {"hospital": hospital, "maintenance_reports": reports}

@app.get("/api/waste")
def get_waste(district_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.WasteReport)
    if district_id:
        query = query.filter(models.WasteReport.district_id == district_id)
    if status and status != "All":
        query = query.filter(models.WasteReport.management_status == status)
    return query.all()

@app.get("/api/pollution")
def get_pollution(district_id: Optional[int] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.PollutionReport)
    if district_id:
        query = query.filter(models.PollutionReport.district_id == district_id)
    if category and category != "All":
        query = query.filter(models.PollutionReport.category == category)
    return query.all()

@app.get("/api/development-needs")
def get_development_needs(district_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.DevelopmentNeed)
    if district_id:
        query = query.filter(models.DevelopmentNeed.district_id == district_id)
    return query.order_by(models.DevelopmentNeed.priority_score.desc()).all()

@app.post("/api/auth/login")
def login(payload: Dict[str, Any], db: Session = Depends(get_db)):
    role = payload.get("role", "citizen")
    user = db.query(models.User).filter(models.User.role == role).first()
    if not user:
        user = models.User(
            username=f"{role}_user",
            full_name=f"JanDrishti {role.capitalize()}",
            role=role,
            phone="9814199999",
            email=f"{role}@jandrishti.org"
        )
    return {
        "success": True,
        "user": user,
        "token": f"jd-token-{role}-{int(datetime.now().timestamp())}"
    }
