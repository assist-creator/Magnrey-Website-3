"""Backend regression tests for Magnrey Consulting API (iteration 2).

Covers: booking slots, leads (with slot), auth login/me, admin stats/leads/newsletter,
insights CMS CRUD, case-studies CMS CRUD.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # fallback: read from frontend/.env
    with open("/app/frontend/.env") as f:
        for ln in f:
            if ln.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = ln.split("=", 1)[1].strip().rstrip("/")

ADMIN_EMAIL = "assist@magnrey.com"
ADMIN_PASSWORD = "MagnreyBoutique2026!"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def token(s):
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data and data["user"]["email"] == ADMIN_EMAIL
    return data["access_token"]


@pytest.fixture()
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------------- Public ----------------
def test_health(s):
    r = s.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_booking_slots(s):
    r = s.get(f"{BASE_URL}/api/booking/slots", timeout=15)
    assert r.status_code == 200
    slots = r.json()["slots"]
    assert isinstance(slots, list) and len(slots) > 0
    for sl in slots[:3]:
        assert "iso" in sl and "date_label" in sl and "time_label" in sl
    # Expect up to 20 slots (2 per weekday x 10 weekdays -> filter out booked)
    assert len(slots) <= 20
    # verify times are 10:00 and 14:00
    times = {sl["time_label"] for sl in slots}
    assert times.issubset({"10:00", "14:00"})


def test_insights_seed_content(s):
    r = s.get(f"{BASE_URL}/api/insights", timeout=15)
    assert r.status_code == 200
    ins = r.json()["insights"]
    # at least 7 seeded (could have TEST leftovers but should still contain 7 seeds)
    ids = {x["id"] for x in ins}
    for expected in [
        "agentic-hr-operating-model",
        "agentic-ai-operating-model",
        "scaling-global-capability-centers",
        "data-governance-75k-records",
        "leading-change-agentic",
        "risk-scored-ai-roadmap",
        "regional-to-unified-global-hr",
    ]:
        assert expected in ids, f"Missing seeded insight {expected}"
    featured = [x for x in ins if x["id"] == "agentic-hr-operating-model"][0]
    assert featured.get("featured") is True


def test_case_studies_seed_content(s):
    r = s.get(f"{BASE_URL}/api/case-studies", timeout=15)
    assert r.status_code == 200
    cases = r.json()["case_studies"]
    headlines = {c["headline"] for c in cases}
    assert "70% of manual HR transactions automated in 9 months" in headlines
    # 5 seeded
    ids = {c["id"] for c in cases}
    for expected in [
        "regulatory-challenge-financial-services",
        "legacy-migration-manufacturing",
        "workforce-analytics-retail",
        "ai-adoption-roadmap-logistics",
        "talent-retention-professional-services",
    ]:
        assert expected in ids, f"Missing seeded case study {expected}"


def test_create_lead_with_slot(s):
    # pick first slot
    slots = s.get(f"{BASE_URL}/api/booking/slots").json()["slots"]
    slot_iso = slots[0]["iso"]
    payload = {
        "full_name": "TEST User",
        "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
        "company": "TEST Co",
        "role": "CHRO",
        "employees": "1,000 – 10,000",
        "interest": "Executive Diagnostic",
        "message": "TEST lead",
        "slot": slot_iso,
    }
    r = s.post(f"{BASE_URL}/api/leads", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["slot"] == slot_iso
    assert body["email"] == payload["email"]
    # slot should now be filtered from available
    slots2 = s.get(f"{BASE_URL}/api/booking/slots").json()["slots"]
    assert slot_iso not in {x["iso"] for x in slots2}


# ---------------- Auth ----------------
def test_login_wrong_password(s):
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
    assert r.status_code == 401


def test_me_requires_token(s):
    r = s.get(f"{BASE_URL}/api/auth/me", timeout=15)
    assert r.status_code == 401


def test_me_with_token(s, auth_headers):
    r = s.get(f"{BASE_URL}/api/auth/me", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# ---------------- Admin read ----------------
def test_admin_endpoints_require_auth(s):
    for p in ["/api/admin/stats", "/api/admin/leads", "/api/admin/newsletter"]:
        assert s.get(f"{BASE_URL}{p}").status_code == 401


def test_admin_stats(s, auth_headers):
    r = s.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    for k in ["leads", "newsletter", "insights", "case_studies", "booked_diagnostics"]:
        assert k in d and isinstance(d[k], int)


def test_admin_leads(s, auth_headers):
    r = s.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "leads" in d and "count" in d
    assert d["count"] == len(d["leads"])


def test_admin_newsletter(s, auth_headers):
    r = s.get(f"{BASE_URL}/api/admin/newsletter", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "subscribers" in d and "count" in d


# ---------------- Insights CMS ----------------
def test_insight_crud(s, auth_headers):
    payload = {
        "category": "TEST",
        "title": f"TEST Insight {uuid.uuid4().hex[:5]}",
        "excerpt": "excerpt here",
        "body": "body content long enough",
        "author": "TEST",
        "date": "2026-01-01",
        "read_minutes": 5,
    }
    r = s.post(f"{BASE_URL}/api/admin/insights", json=payload, headers=auth_headers, timeout=15)
    assert r.status_code == 201, r.text
    created = r.json()
    assert created["id"] and created["title"] == payload["title"]
    ins_id = created["id"]
    # slug lowercase kebab
    assert ins_id == ins_id.lower() and " " not in ins_id

    # verify listed
    lst = s.get(f"{BASE_URL}/api/insights").json()["insights"]
    assert any(x["id"] == ins_id for x in lst)

    # update
    upd = {**payload, "title": payload["title"] + " EDIT", "read_minutes": 10}
    r = s.put(f"{BASE_URL}/api/admin/insights/{ins_id}", json=upd, headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["read_minutes"] == 10

    # delete
    r = s.delete(f"{BASE_URL}/api/admin/insights/{ins_id}", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    # 404 second time
    assert s.delete(f"{BASE_URL}/api/admin/insights/{ins_id}", headers=auth_headers).status_code == 404


# ---------------- Case Studies CMS ----------------
def test_case_study_crud(s, auth_headers):
    payload = {
        "sector": "TEST Sector",
        "engagement": "TEST Engagement",
        "employees": "1,000",
        "geography": "UK",
        "duration": "3 months",
        "headline": f"TEST Case Study {uuid.uuid4().hex[:5]}",
        "challenge": "challenge text",
        "approach": "approach text",
        "outcomes": ["Outcome A", "Outcome B"],
    }
    r = s.post(f"{BASE_URL}/api/admin/case-studies", json=payload, headers=auth_headers, timeout=15)
    assert r.status_code == 201, r.text
    created = r.json()
    cid = created["id"]
    assert created["outcomes"] == payload["outcomes"]
    assert cid == cid.lower() and " " not in cid

    upd = {**payload, "duration": "5 months", "outcomes": ["X"]}
    r = s.put(f"{BASE_URL}/api/admin/case-studies/{cid}", json=upd, headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["duration"] == "5 months"
    assert r.json()["outcomes"] == ["X"]

    r = s.delete(f"{BASE_URL}/api/admin/case-studies/{cid}", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert s.get(f"{BASE_URL}/api/case-studies").json()
