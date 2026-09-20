from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import logging
import uuid
import bcrypt
import jwt
import re
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ============ Config ============
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 12  # 12h for admin session
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Magnrey Consulting API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    t = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    t = re.sub(r"\s+", "-", t)
    return t[:80] or uuid.uuid4().hex[:8]


# ============ Auth ============
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = None
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============ Models ============
class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: str = Field(min_length=1, max_length=160)
    role: Optional[str] = Field(default=None, max_length=120)
    employees: Optional[str] = Field(default=None, max_length=40)
    interest: Optional[Literal[
        "AI & Digital Advisory",
        "Project Advisory",
        "Systems Implementation",
        "Executive Diagnostic",
        "General Enquiry",
    ]] = "Executive Diagnostic"
    message: Optional[str] = Field(default="", max_length=2000)
    slot: Optional[str] = Field(default=None, max_length=64)  # ISO datetime string


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=utcnow_iso)


class NewsletterCreate(BaseModel):
    email: EmailStr


class Newsletter(NewsletterCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=utcnow_iso)


class InsightIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    category: str = Field(min_length=1, max_length=60)
    title: str = Field(min_length=3, max_length=200)
    excerpt: str = Field(min_length=3, max_length=500)
    body: str = Field(min_length=3, max_length=20000)
    author: str = Field(min_length=1, max_length=120)
    date: str = Field(min_length=8, max_length=32)
    read_minutes: int = Field(ge=1, le=60)


class CaseStudyIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    sector: str
    engagement: str
    employees: str
    geography: str
    duration: str
    headline: str
    challenge: str
    approach: str
    outcomes: List[str] = Field(default_factory=list)


# ============ Static Seed Content ============
_SEED_INSIGHTS = [
    {
        "id": "agentic-hr-operating-model",
        "category": "Frameworks",
        "read_minutes": 7,
        "title": "The Agentic HR Operating Model: A Practitioner's Field Guide",
        "excerpt": "How enterprise HR functions are redesigning operating models around agentic AI without losing operational discipline. Drawn from engagements spanning workforce platforms, global service delivery, and change management.",
        "author": "Rinnieta Chrestien",
        "date": "2025-11-14",
        "body": "The agentic HR operating model is not a tooling upgrade — it is a re-architecture of how People work flows across humans and agents. This field guide translates that architecture into concrete design choices: decision-rights across agent/human handoffs, governance council structure, and the sequencing rules that separate compressed time-to-value from sunk pilot cost.",
        "featured": True,
    },
    {
        "id": "agentic-ai-operating-model",
        "category": "Articles",
        "read_minutes": 6,
        "title": "Why Agentic AI Changes the HR Operating Model, Not Just the Tools",
        "excerpt": "Deploying AI agents into HR workflows fails when it is treated as a tooling upgrade rather than an operating-model redesign.",
        "author": "Magnrey Strategy Practice",
        "date": "2025-10-22",
        "body": "Every HR AI pilot that stalls has the same signature: the tool works in isolation but breaks against the operating model. The fix is not more prompt engineering — it is redesigning where decision authority sits when an agent enters the workflow.",
    },
    {
        "id": "scaling-global-capability-centers",
        "category": "Frameworks",
        "read_minutes": 8,
        "title": "A Practical Framework for Scaling Global Capability Centers",
        "excerpt": "A phased model for standing up and scaling GCCs without sacrificing local responsiveness.",
        "author": "Magnrey Strategy Practice",
        "date": "2025-09-30",
        "body": "GCCs fail when the transition to shared services outpaces local capability. The framework here sequences the five capability domains that must land before any activity migrates — with clear tests for whether each is ready.",
    },
    {
        "id": "data-governance-75k-records",
        "category": "Trends",
        "read_minutes": 5,
        "title": "What 75,000 Employee Records Taught Us About Data Governance",
        "excerpt": "Lessons from consolidating fragmented HRIS data into a single analytics layer at enterprise scale.",
        "author": "Magnrey Strategy Practice",
        "date": "2025-09-10",
        "body": "At enterprise scale, governance is an architecture problem long before it is a policy problem. These are the seven inflection points we hit consolidating 75,000 employee records into one analytics layer.",
    },
    {
        "id": "leading-change-agentic",
        "category": "Articles",
        "read_minutes": 7,
        "title": "Leading Change When 'Agentic' Still Feels Abstract to Your Workforce",
        "excerpt": "Practical language and sequencing for change programmes introducing agentic AI to skeptical teams.",
        "author": "Magnrey Strategy Practice",
        "date": "2025-08-20",
        "body": "Skepticism about agentic AI is not a communications problem. It is a legitimacy problem. This piece frames the four narrative shifts we use to turn skepticism into ownership.",
    },
    {
        "id": "risk-scored-ai-roadmap",
        "category": "Frameworks",
        "read_minutes": 6,
        "title": "A Risk-Scored Roadmap for AI Adoption in HR",
        "excerpt": "How to sequence AI adoption initiatives by risk and readiness rather than hype.",
        "author": "Magnrey Strategy Practice",
        "date": "2025-08-04",
        "body": "The risk-scored roadmap replaces the usual 'pick a use case' with a disciplined scoring model across data readiness, workforce impact, compliance surface and reversibility.",
    },
    {
        "id": "regional-to-unified-global-hr",
        "category": "Trends",
        "read_minutes": 6,
        "title": "The Shift From Regional HR Silos to Unified Global Delivery",
        "excerpt": "Why more enterprises are consolidating regional HR operations into unified global service delivery models.",
        "author": "Magnrey Strategy Practice",
        "date": "2025-07-18",
        "body": "The economics of regional silos have shifted decisively. Unified global delivery is now the default for organisations above 25,000 employees — but only when three preconditions are met.",
    },
]


_SEED_CASE_STUDIES = [
    {
        "id": "regulatory-challenge-financial-services",
        "sector": "Global Financial Services",
        "engagement": "Regulatory Challenge",
        "employees": "Global scale",
        "geography": "15 jurisdictions",
        "duration": "12 months",
        "headline": "Zero audit findings across 15 jurisdictions",
        "challenge": "A global financial services firm needed to harmonise HR compliance across fifteen regulatory regimes without slowing quarterly hiring targets.",
        "approach": "Magnrey embedded governance directly into the operating model, aligning payroll, statutory reporting and mobility controls into a single control fabric — audited quarterly.",
        "outcomes": [
            "Zero audit findings post go-live",
            "No degradation to hiring velocity",
            "Single control fabric across 15 jurisdictions",
            "Executive dashboards accepted as audit evidence",
        ],
    },
    {
        "id": "legacy-migration-manufacturing",
        "sector": "Manufacturing Group",
        "engagement": "Legacy System Migration",
        "employees": "Multinational",
        "geography": "Global",
        "duration": "10 months",
        "headline": "40% faster time-to-hire post-migration",
        "challenge": "A manufacturing group was running payroll and recruiting on three disconnected legacy systems, blocking any enterprise-wide people view.",
        "approach": "We led a phased Workday migration with zero disruption to live hiring cycles — sequencing waves against the seasonal recruitment calendar.",
        "outcomes": [
            "40% faster time-to-hire",
            "Zero disruption to live hiring during transition",
            "Consolidated payroll across three legacy platforms",
            "Data quality lifted to 99%+ within 90 days",
        ],
    },
    {
        "id": "workforce-analytics-retail",
        "sector": "Multinational Retail",
        "engagement": "Workforce Analytics at Scale",
        "employees": "1.2M records",
        "geography": "Global",
        "duration": "1 quarter to live",
        "headline": "1.2M employee records unified into one source of truth",
        "challenge": "A multinational retailer's people data was fragmented across regional HRIS instances — blocking every workforce planning decision above regional scale.",
        "approach": "We consolidated the fragmented data into a single analytics layer, live for leadership within one quarter — with a governance model that keeps it clean.",
        "outcomes": [
            "1.2M records unified into one source of truth",
            "Live for executive leadership within one quarter",
            "Data governance model sustained post-engagement",
            "Enterprise workforce planning cadence established",
        ],
    },
    {
        "id": "ai-adoption-roadmap-logistics",
        "sector": "Global Logistics",
        "engagement": "AI Adoption Roadmap",
        "employees": "Enterprise scale",
        "geography": "Global",
        "duration": "9 months",
        "headline": "70% of manual HR transactions automated in 9 months",
        "challenge": "A logistics enterprise wanted AI-native operations without disrupting frontline service levels.",
        "approach": "We phased in agentic workflows against a disciplined, risk-scored roadmap — anchored by a governance council chaired by the COO.",
        "outcomes": [
            "70% of manual HR transactions automated",
            "Zero degradation to frontline service levels",
            "Governance council chaired by COO",
            "Risk-scored roadmap adopted as ongoing operating standard",
        ],
    },
    {
        "id": "talent-retention-professional-services",
        "sector": "Professional Services",
        "engagement": "Talent Retention Turnaround",
        "employees": "Enterprise scale",
        "geography": "Global",
        "duration": "12 months",
        "headline": "eNPS lifted 28 points in one year",
        "challenge": "A professional services firm was losing senior talent faster than it could backfill — with a widening gap between stated culture and lived experience.",
        "approach": "A redesigned People experience — from onboarding through career mobility — turned attrition into the firm's strongest retention story yet.",
        "outcomes": [
            "eNPS lifted 28 points in one year",
            "Senior attrition reversed within two quarters",
            "Internal mobility rate more than doubled",
            "Retention story cited in the firm's next annual report",
        ],
    },
]


# ============ Startup ============
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.newsletter.create_index("email", unique=True)
    await db.insights.create_index("id", unique=True)
    await db.case_studies.create_index("id", unique=True)

    # Seed admin (idempotent, updates password if changed)
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Founding Partner",
            "role": "admin",
            "created_at": utcnow_iso(),
        })
        logger.info("Seeded admin user: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Updated admin password for %s", admin_email)

    # Seed insights & case-studies if empty
    if await db.insights.count_documents({}) == 0:
        for item in _SEED_INSIGHTS:
            item = {**item, "created_at": utcnow_iso()}
            await db.insights.insert_one(item)
        logger.info("Seeded %d insights", len(_SEED_INSIGHTS))
    if await db.case_studies.count_documents({}) == 0:
        for item in _SEED_CASE_STUDIES:
            item = {**item, "created_at": utcnow_iso()}
            await db.case_studies.insert_one(item)
        logger.info("Seeded %d case studies", len(_SEED_CASE_STUDIES))


@app.on_event("shutdown")
async def shutdown():
    client.close()


# ============ Public Routes ============
@api_router.get("/")
async def root():
    return {"service": "Magnrey Consulting API", "status": "operational"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "timestamp": utcnow_iso()}


@api_router.get("/insights")
async def list_insights():
    docs = await db.insights.find({}, {"_id": 0}).sort("date", -1).to_list(200)
    return {"insights": docs}


@api_router.get("/case-studies")
async def list_case_studies():
    docs = await db.case_studies.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"case_studies": docs}


@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    logger.info("New lead: %s / %s (slot=%s)", lead.email, lead.company, lead.slot)
    return lead


@api_router.post("/newsletter", response_model=Newsletter, status_code=201)
async def newsletter_signup(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        return existing
    sub = Newsletter(**payload.model_dump())
    await db.newsletter.insert_one(sub.model_dump())
    return sub


# ============ Booking (calendar slots) ============
@api_router.get("/booking/slots")
async def get_available_slots():
    """Generate 5 business days of slots at 10:00 and 14:00 UK time. Filter out any already booked."""
    booked = await db.leads.find({"slot": {"$ne": None}}, {"_id": 0, "slot": 1}).to_list(500)
    booked_set = {b["slot"] for b in booked if b.get("slot")}

    now = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    slots = []
    day = now + timedelta(days=1)  # start tomorrow
    days_added = 0
    while days_added < 10:
        if day.weekday() < 5:  # Mon-Fri
            for hour in (10, 14):
                candidate = day.replace(hour=hour)
                iso = candidate.isoformat()
                if iso not in booked_set:
                    slots.append({
                        "iso": iso,
                        "date_label": candidate.strftime("%a, %d %b"),
                        "time_label": candidate.strftime("%H:%M"),
                    })
            days_added += 1
        day += timedelta(days=1)
    return {"slots": slots}


# ============ Auth Routes ============
@api_router.post("/auth/login")
async def login(payload: LoginPayload):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")},
    }


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_admin)):
    return user


# ============ Admin Routes ============
@api_router.get("/admin/leads")
async def admin_leads(limit: int = 200, user: dict = Depends(get_current_admin)):
    limit = max(1, min(limit, 500))
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"leads": docs, "count": len(docs)}


@api_router.get("/admin/newsletter")
async def admin_newsletter(limit: int = 200, user: dict = Depends(get_current_admin)):
    limit = max(1, min(limit, 500))
    docs = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"subscribers": docs, "count": len(docs)}


@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(get_current_admin)):
    leads = await db.leads.count_documents({})
    subs = await db.newsletter.count_documents({})
    ins = await db.insights.count_documents({})
    cases = await db.case_studies.count_documents({})
    booked = await db.leads.count_documents({"slot": {"$ne": None}})
    return {"leads": leads, "newsletter": subs, "insights": ins, "case_studies": cases, "booked_diagnostics": booked}


# ---- Insights CMS ----
@api_router.post("/admin/insights", status_code=201)
async def create_insight(payload: InsightIn, user: dict = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = slugify(payload.title)
    # Ensure unique id
    if await db.insights.find_one({"id": doc["id"]}):
        doc["id"] = f"{doc['id']}-{uuid.uuid4().hex[:5]}"
    doc["created_at"] = utcnow_iso()
    await db.insights.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/insights/{item_id}")
async def update_insight(item_id: str, payload: InsightIn, user: dict = Depends(get_current_admin)):
    res = await db.insights.update_one({"id": item_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    updated = await db.insights.find_one({"id": item_id}, {"_id": 0})
    return updated


@api_router.delete("/admin/insights/{item_id}")
async def delete_insight(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.insights.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    return {"deleted": item_id}


# ---- Case Studies CMS ----
@api_router.post("/admin/case-studies", status_code=201)
async def create_case_study(payload: CaseStudyIn, user: dict = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = slugify(payload.headline)
    if await db.case_studies.find_one({"id": doc["id"]}):
        doc["id"] = f"{doc['id']}-{uuid.uuid4().hex[:5]}"
    doc["created_at"] = utcnow_iso()
    await db.case_studies.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/case-studies/{item_id}")
async def update_case_study(item_id: str, payload: CaseStudyIn, user: dict = Depends(get_current_admin)):
    res = await db.case_studies.update_one({"id": item_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Case study not found")
    updated = await db.case_studies.find_one({"id": item_id}, {"_id": 0})
    return updated


@api_router.delete("/admin/case-studies/{item_id}")
async def delete_case_study(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.case_studies.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Case study not found")
    return {"deleted": item_id}


# ============ Mount ============
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
