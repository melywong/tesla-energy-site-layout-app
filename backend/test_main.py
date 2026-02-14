import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


def test_create_and_list_sessions():
    res = client.post("/api/sessions", json={
        "name": "Test Site",
        "config": {"selections": [{"deviceId": "megapack", "quantity": 2}]},
    })
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Test Site"
    assert data["id"] is not None

    res = client.get("/api/sessions")
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_session():
    res = client.post("/api/sessions", json={
        "name": "Get Test",
        "config": {"selections": []},
    })
    session_id = res.json()["id"]

    res = client.get(f"/api/sessions/{session_id}")
    assert res.status_code == 200
    assert res.json()["name"] == "Get Test"


def test_get_session_not_found():
    res = client.get("/api/sessions/9999")
    assert res.status_code == 404


def test_delete_session():
    res = client.post("/api/sessions", json={
        "name": "Delete Me",
        "config": {"selections": []},
    })
    session_id = res.json()["id"]

    res = client.delete(f"/api/sessions/{session_id}")
    assert res.status_code == 200

    res = client.get(f"/api/sessions/{session_id}")
    assert res.status_code == 404
