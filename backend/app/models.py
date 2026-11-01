from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    total_sanctioned = Column(Float, default=0.0)
    total_released = Column(Float, default=0.0)
    total_spent = Column(Float, default=0.0)

    blocks = relationship("Block", back_populates="district")
    projects = relationship("Project", back_populates="district")

class Block(Base):
    __tablename__ = "blocks"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, nullable=False)

    district = relationship("District", back_populates="blocks")
    panchayats = relationship("Panchayat", back_populates="block")

class Panchayat(Base):
    __tablename__ = "panchayats"

    id = Column(Integer, primary_key=True, index=True)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    population = Column(Integer, default=2000)

    block = relationship("Block", back_populates="panchayats")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    panchayat_id = Column(Integer, ForeignKey("panchayats.id"), nullable=False)
    department = Column(String(150), nullable=False)
    scheme = Column(String(150), nullable=False)
    contractor_name = Column(String(150), nullable=False)
    contractor_id = Column(String(50), nullable=False)
    sanctioned_amount = Column(Float, nullable=False)
    released_amount = Column(Float, nullable=False)
    paid_to_contractor = Column(Float, nullable=False)
    recorded_expenditure = Column(Float, nullable=False)
    start_date = Column(String(50), nullable=False)
    expected_completion = Column(String(50), nullable=False)
    actual_completion = Column(String(50), nullable=True)
    reported_progress_pct = Column(Float, default=0.0)
    status = Column(String(50), nullable=False)
    official_source_url = Column(String(255), nullable=False)
    source_name = Column(String(100), nullable=False)
    data_retrieval_date = Column(String(50), nullable=False)
    verification_status = Column(String(50), default="verified")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    is_demo = Column(Integer, default=1)

    district = relationship("District", back_populates="projects")
    complaints = relationship("Complaint", back_populates="project")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String(50), unique=True, nullable=False)
    citizen_name = Column(String(150), nullable=False)
    citizen_phone = Column(String(50), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    panchayat_id = Column(Integer, ForeignKey("panchayats.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    photo_url = Column(String(255), nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    status = Column(String(50), default="Submitted")
    priority = Column(String(50), default="medium")
    assigned_to_role = Column(String(100), nullable=True)
    assigned_official_name = Column(String(150), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    feedback_rating = Column(Integer, nullable=True)
    feedback_comment = Column(Text, nullable=True)
    submitted_at = Column(String(50), nullable=False)
    updated_at = Column(String(50), nullable=False)
    is_demo = Column(Integer, default=1)

    project = relationship("Project", back_populates="complaints")
    history = relationship("ComplaintHistory", back_populates="complaint")

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    previous_status = Column(String(50), nullable=False)
    new_status = Column(String(50), nullable=False)
    changed_by_role = Column(String(100), nullable=False)
    officer_name = Column(String(150), nullable=False)
    remarks = Column(Text, nullable=False)
    timestamp = Column(String(50), nullable=False)

    complaint = relationship("Complaint", back_populates="history")

class MonitoringAnalysis(Base):
    __tablename__ = "monitoring_analyses"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    analysis_type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    before_image_url = Column(String(255), nullable=True)
    after_image_url = Column(String(255), nullable=False)
    model_estimated_progress_pct = Column(Float, default=0.0)
    administrative_reported_pct = Column(Float, default=0.0)
    variance_pct = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.85)
    potholes_detected = Column(Integer, default=0)
    surface_distress_index = Column(Float, default=0.0)
    greenery_coverage_pct = Column(Float, default=0.0)
    status = Column(String(50), default="verified_consistent")
    findings_summary = Column(Text, nullable=False)
    inference_mode = Column(String(50), default="deterministic_rule")
    timestamp = Column(String(50), nullable=False)
    is_demo = Column(Integer, default=1)

class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    category = Column(String(50), nullable=False)
    severity = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=False)
    supporting_records = Column(Text, nullable=False)
    financial_variance = Column(Float, default=0.0)
    detected_at = Column(String(50), nullable=False)
    review_status = Column(String(50), default="open")
    suggested_action = Column(Text, nullable=False)
    detection_method = Column(String(50), default="deterministic_rule")

class WasteReport(Base):
    __tablename__ = "waste_reports"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String(50), unique=True, nullable=False)
    location = Column(String(255), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    panchayat_id = Column(Integer, ForeignKey("panchayats.id"), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    severity = Column(String(50), default="medium")
    description = Column(Text, nullable=False)
    photo_url = Column(String(255), nullable=True)
    after_photo_url = Column(String(255), nullable=True)
    reported_by = Column(String(150), nullable=False)
    reported_date = Column(String(50), nullable=False)
    assigned_department = Column(String(150), default="Panchayat Sanitation Wing")
    assigned_officer = Column(String(150), nullable=True)
    management_status = Column(String(50), default="Reported")
    scheduled_collection_date = Column(String(50), nullable=True)
    actual_collection_date = Column(String(50), nullable=True)
    disposal_method = Column(String(100), nullable=True)
    is_managed = Column(Integer, default=0)
    is_demo = Column(Integer, default=1)

class PollutionReport(Base):
    __tablename__ = "pollution_reports"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String(50), unique=True, nullable=False)
    location = Column(String(255), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    panchayat_id = Column(Integer, ForeignKey("panchayats.id"), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    aqi = Column(Integer, default=140)
    pm25 = Column(Float, default=48.5)
    pm10 = Column(Float, default=95.0)
    reading_unit = Column(String(50), default="µg/m³")
    possible_causes = Column(Text, nullable=False)
    supporting_evidence = Column(Text, nullable=False)
    confidence_level = Column(String(50), default="Moderate")
    status = Column(String(50), default="Reported")
    recorded_date = Column(String(50), nullable=False)
    data_source = Column(String(100), default="CPCB Sensor Grid")
    is_demo = Column(Integer, default=1)

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    panchayat_id = Column(Integer, ForeignKey("panchayats.id"), nullable=False)
    address = Column(String(255), nullable=False)
    managing_authority = Column(String(150), nullable=False)
    contact_person = Column(String(150), nullable=False)
    status = Column(String(100), default="Good")
    last_inspection_date = Column(String(50), nullable=False)
    is_demo = Column(Integer, default=1)

    reports = relationship("SchoolMaintenanceReport", back_populates="school")

class SchoolMaintenanceReport(Base):
    __tablename__ = "school_maintenance_reports"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    reporting_week = Column(String(100), nullable=False)
    week_start_date = Column(String(50), nullable=False)
    week_end_date = Column(String(50), nullable=False)
    building_condition = Column(Text, nullable=False)
    classrooms_condition = Column(Text, nullable=False)
    toilets_sanitation = Column(Text, nullable=False)
    drinking_water = Column(Text, nullable=False)
    electricity_power = Column(Text, nullable=False)
    desks_furniture = Column(Text, nullable=False)
    fire_safety = Column(Text, nullable=False)
    repairs_completed = Column(Text, nullable=True)
    repairs_pending = Column(Text, nullable=True)
    maintenance_expenditure = Column(Float, default=0.0)
    inspection_date = Column(String(50), nullable=False)
    reporting_officer = Column(String(150), nullable=False)
    verification_status = Column(String(50), default="Verified")
    notes = Column(Text, nullable=True)
    is_demo = Column(Integer, default=1)

    school = relationship("School", back_populates="reports")

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    facility_type = Column(String(100), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    panchayat_id = Column(Integer, ForeignKey("panchayats.id"), nullable=False)
    address = Column(String(255), nullable=False)
    managing_authority = Column(String(150), nullable=False)
    status = Column(String(100), default="Good")
    last_inspection_date = Column(String(50), nullable=False)
    is_demo = Column(Integer, default=1)

    reports = relationship("HospitalMaintenanceReport", back_populates="hospital")

class HospitalMaintenanceReport(Base):
    __tablename__ = "hospital_maintenance_reports"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    reporting_week = Column(String(100), nullable=False)
    week_start_date = Column(String(50), nullable=False)
    week_end_date = Column(String(50), nullable=False)
    building_cleanliness = Column(Text, nullable=False)
    safe_water = Column(Text, nullable=False)
    electricity_backup_power = Column(Text, nullable=False)
    toilets_sanitation = Column(Text, nullable=False)
    biomedical_waste_segregation = Column(Text, nullable=False)
    fire_safety_exits = Column(Text, nullable=False)
    essential_equipment_status = Column(Text, nullable=False)
    repairs_completed = Column(Text, nullable=True)
    repairs_pending = Column(Text, nullable=True)
    maintenance_expenditure = Column(Float, default=0.0)
    inspection_date = Column(String(50), nullable=False)
    reporting_officer = Column(String(150), nullable=False)
    verification_status = Column(String(50), default="Verified")
    notes = Column(Text, nullable=True)
    is_demo = Column(Integer, default=1)

    hospital = relationship("Hospital", back_populates="reports")

class DevelopmentNeed(Base):
    __tablename__ = "development_needs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)
    panchayat_id = Column(Integer, ForeignKey("panchayats.id"), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    citizen_name = Column(String(150), nullable=False)
    citizen_phone = Column(String(50), nullable=False)
    supporting_residents_count = Column(Integer, default=1)
    priority_score = Column(Integer, default=50)
    status = Column(String(100), default="Registered")
    submitted_at = Column(String(50), nullable=False)
    is_demo = Column(Integer, default=1)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(150), nullable=True)
    password_hash = Column(String(255), default="demo_hash")
    full_name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), nullable=False)
    designation = Column(String(150), nullable=True)
    department = Column(String(150), nullable=True)
    assigned_district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    state = Column(String(100), default="Punjab")
    district = Column(String(100), nullable=True)
    locality = Column(String(100), nullable=True)
