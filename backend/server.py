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
        "id": "ai-native-people-function",
        "category": "AI Strategy",
        "read_minutes": 8,
        "title": "The AI-Native People Function: From Cost Centre to Value Engine",
        "excerpt": "The vast majority of HR AI pilots stall between proof-of-concept and enterprise deployment. A disciplined six-stage architecture is what separates lasting transformation from expensive experimentation.",
        "author": "Rinnieta Chrestien",
        "date": "2025-11-14",
        "body": "For the past three years, the boardroom conversation has centered on whether AI belongs in HR. The wrong question. The right question is whether HR belongs in an AI-native enterprise — and if so, how it must be re-architected around agentic workflows, data governance, and continuous value realisation. This piece breaks down the four architectural moves that distinguish the top-quartile People Function of 2026.",
    },
    {
        "id": "workday-dayforce-parallel",
        "category": "HCM Systems",
        "read_minutes": 6,
        "title": "Workday vs. Dayforce: A Practitioner's Comparative Blueprint",
        "excerpt": "Both platforms promise the same outcome. Neither delivers it without disciplined operating-model engineering. The differentiator is never the software.",
        "author": "Magnrey Practice",
        "date": "2025-10-02",
        "body": "The choice between Workday and Dayforce is often framed as a technology decision. In practice, it is an operating-model decision. We compare the two platforms across seven dimensions that matter in the boardroom: total cost of change, workforce scalability, data-lake extensibility, agentic readiness, compliance surface, upgrade cadence, and vendor governance.",
    },
    {
        "id": "senior-led-consulting",
        "category": "Consulting Model",
        "read_minutes": 5,
        "title": "The Case Against the Pyramid: Why Senior-Led Delivery Wins",
        "excerpt": "The traditional consulting pyramid was engineered for a very different economy. Boutique senior-led engagement is not a cost premium — it is a compression of time-to-value.",
        "author": "Rinnieta Chrestien",
        "date": "2025-09-11",
        "body": "Enterprise clients no longer need armies of junior analysts producing PowerPoint. They need three or four practitioners who have actually done the work, engaging peer-to-peer with the executive committee. This piece frames the economics.",
    },
    {
        "id": "compliance-by-design",
        "category": "Governance",
        "read_minutes": 7,
        "title": "Compliance by Design: Embedding GDPR & SOX Into the AI Stack",
        "excerpt": "Regulatory findings are almost never a legal failure. They are an architectural failure. Embedding compliance as a governance primitive is a first-principles design choice.",
        "author": "Magnrey Practice",
        "date": "2025-08-20",
        "body": "We walk through the reference architecture that has delivered zero audit findings across four multi-jurisdictional Workday deployments — from data classification and consent flows to model interpretability and audit-trail immutability.",
    },
]


_SEED_CASE_STUDIES = [
    {
        "id": "global-fintech-workday",
        "sector": "Global FinTech",
        "engagement": "Workday Global Deployment",
        "employees": "42,000",
        "geography": "27 countries",
        "duration": "14 months",
        "headline": "From 11 Fragmented HRIS to a Single Workday Core",
        "challenge": "A publicly listed payments network operating across 27 jurisdictions had grown by acquisition into 11 disconnected HR systems, blocking any enterprise view of workforce cost, mobility, or risk.",
        "approach": "Magnrey led the operating-model redesign, sequenced a phased Workday deployment across three waves, and orchestrated the systems-integrator ecosystem — with zero junior handoffs.",
        "outcomes": [
            "Single source of truth across 27 jurisdictions",
            "€28M annualised operational efficiency",
            "Zero regulatory findings in first post-go-live audit",
            "38% lift in internal lateral mobility for critical engineering roles",
        ],
    },
    {
        "id": "healthtech-ai-copilot",
        "sector": "FTSE 100 HealthTech",
        "engagement": "AI Talent Intelligence Copilot",
        "employees": "68,000",
        "geography": "Europe & North America",
        "duration": "9 months",
        "headline": "An Agentic Copilot That Sees Every Career Path",
        "challenge": "The CHRO needed an AI layer that could reason across skills, roles, business-unit strategy, and regulatory posture — with the interpretability required for a life-sciences audit trail.",
        "approach": "Magnrey formulated the agentic architecture, selected the model stack, and led the co-design with the internal AI platform team. Deployment was staged behind a governance council chaired by the Chief Data Officer.",
        "outcomes": [
            "Sub-90 day time-to-value for the first cohort",
            "Verified GDPR & SOX adherence with immutable audit trail",
            "42% acceleration in strategic role fill-time",
            "eNPS +17 among high-potential engineering cohort",
        ],
    },
    {
        "id": "asset-manager-dayforce",
        "sector": "Tier-1 Asset Manager",
        "engagement": "Dayforce Modernisation",
        "employees": "18,500",
        "geography": "14 jurisdictions",
        "duration": "11 months",
        "headline": "Compliance-First Dayforce Rollout Across 14 Jurisdictions",
        "challenge": "A multi-asset manager needed to retire a legacy on-premise HRIS while tightening cross-border compliance ahead of a regulatory review.",
        "approach": "Magnrey engineered a compliance-first target operating model, then led the Dayforce implementation with an embedded audit workstream running in parallel to configuration.",
        "outcomes": [
            "55% reduction in onboarding friction",
            "Zero audit findings across 14 jurisdictions",
            "Payroll accuracy lifted to 99.94%",
            "Manager self-service adoption at 91% within 90 days",
        ],
    },
    {
        "id": "cpg-operating-model",
        "sector": "Global Consumer Goods",
        "engagement": "People Function Operating Model",
        "employees": "112,000",
        "geography": "34 countries",
        "duration": "7 months",
        "headline": "A People Function Re-Architected Around AI",
        "challenge": "The People Function was structurally over-weighted on transactional work, leaving strategic capability starved of investment as the business faced a step-change in category dynamics.",
        "approach": "Magnrey led the target-operating-model design, mapped agentic workflow candidates against a value-driver tree, and delivered a 24-month sequencing plan governed by an executive value council.",
        "outcomes": [
            "31% redirection of capacity from admin to strategic work",
            "Board-approved AI investment envelope of $46M",
            "12 agentic workflows identified with verified ROI",
            "Executive sponsorship at CFO and CEO level",
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
