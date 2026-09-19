from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Magnrey Consulting API")
api_router = APIRouter(prefix="/api")


def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ============ Models ============
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


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=utcnow_iso)


class NewsletterCreate(BaseModel):
    email: EmailStr


class Newsletter(NewsletterCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=utcnow_iso)


# ============ Routes ============
@api_router.get("/")
async def root():
    return {"service": "Magnrey Consulting API", "status": "operational"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "timestamp": utcnow_iso()}


@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    logger.info("New lead: %s / %s", lead.email, lead.company)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(limit: int = 100):
    limit = max(1, min(limit, 500))
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api_router.post("/newsletter", response_model=Newsletter, status_code=201)
async def newsletter_signup(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        return existing
    sub = Newsletter(**payload.model_dump())
    await db.newsletter.insert_one(sub.model_dump())
    return sub


@api_router.get("/newsletter", response_model=List[Newsletter])
async def list_newsletter(limit: int = 100):
    limit = max(1, min(limit, 500))
    docs = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api_router.get("/insights")
async def list_insights():
    # Curated thought leadership content (static content managed in-code)
    return {"insights": _INSIGHTS}


@api_router.get("/case-studies")
async def list_case_studies():
    return {"case_studies": _CASE_STUDIES}


# ============ Curated Static Content ============
_INSIGHTS = [
    {
        "id": "ai-native-people-function",
        "category": "AI Strategy",
        "read_minutes": 8,
        "title": "The AI-Native People Function: From Cost Centre to Value Engine",
        "excerpt": "The vast majority of HR AI pilots stall between proof-of-concept and enterprise deployment. A disciplined six-stage architecture is what separates lasting transformation from expensive experimentation.",
        "author": "Rinnieta Chrestien",
        "date": "2025-11-14",
        "body": "For the past three years, the boardroom conversation has centered on whether AI belongs in HR. The wrong question. The right question is whether HR belongs in an AI-native enterprise — and if so, how it must be re-architected around agentic workflows, data governance, and continuous value realisation. This piece breaks down the four architectural moves that distinguish the top-quartile People Function of 2026."
    },
    {
        "id": "workday-dayforce-parallel",
        "category": "HCM Systems",
        "read_minutes": 6,
        "title": "Workday vs. Dayforce: A Practitioner's Comparative Blueprint",
        "excerpt": "Both platforms promise the same outcome. Neither delivers it without disciplined operating-model engineering. The differentiator is never the software.",
        "author": "Magnrey Practice",
        "date": "2025-10-02",
        "body": "The choice between Workday and Dayforce is often framed as a technology decision. In practice, it is an operating-model decision. We compare the two platforms across seven dimensions that matter in the boardroom: total cost of change, workforce scalability, data-lake extensibility, agentic readiness, compliance surface, upgrade cadence, and vendor governance."
    },
    {
        "id": "senior-led-consulting",
        "category": "Consulting Model",
        "read_minutes": 5,
        "title": "The Case Against the Pyramid: Why Senior-Led Delivery Wins",
        "excerpt": "The traditional consulting pyramid was engineered for a very different economy. Boutique senior-led engagement is not a cost premium — it is a compression of time-to-value.",
        "author": "Rinnieta Chrestien",
        "date": "2025-09-11",
        "body": "Enterprise clients no longer need armies of junior analysts producing PowerPoint. They need three or four practitioners who have actually done the work, engaging peer-to-peer with the executive committee. This piece frames the economics."
    },
    {
        "id": "compliance-by-design",
        "category": "Governance",
        "read_minutes": 7,
        "title": "Compliance by Design: Embedding GDPR & SOX Into the AI Stack",
        "excerpt": "Regulatory findings are almost never a legal failure. They are an architectural failure. Embedding compliance as a governance primitive is a first-principles design choice.",
        "author": "Magnrey Practice",
        "date": "2025-08-20",
        "body": "We walk through the reference architecture that has delivered zero audit findings across four multi-jurisdictional Workday deployments — from data classification and consent flows to model interpretability and audit-trail immutability."
    },
]


_CASE_STUDIES = [
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


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
