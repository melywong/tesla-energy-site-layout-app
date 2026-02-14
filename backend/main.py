import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from database import engine, get_db, Base
from models import Session

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tesla Energy Site Layout API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SessionCreate(BaseModel):
    name: str
    config: dict


class SessionResponse(BaseModel):
    id: int
    name: str
    config: dict
    createdAt: str

    class Config:
        from_attributes = True


def session_to_response(s: Session) -> dict:
    return {
        "id": s.id,
        "name": s.name,
        "config": json.loads(s.config),
        "createdAt": s.created_at.isoformat() if s.created_at else "",
    }


@app.post("/api/sessions", response_model=SessionResponse)
def create_session(data: SessionCreate, db: DBSession = Depends(get_db)):
    session = Session(name=data.name, config=json.dumps(data.config))
    db.add(session)
    db.commit()
    db.refresh(session)
    return session_to_response(session)


@app.get("/api/sessions")
def list_sessions(db: DBSession = Depends(get_db)):
    sessions = db.query(Session).order_by(Session.created_at.desc()).all()
    return [session_to_response(s) for s in sessions]


@app.get("/api/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: DBSession = Depends(get_db)):
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session_to_response(session)


@app.delete("/api/sessions/{session_id}")
def delete_session(session_id: int, db: DBSession = Depends(get_db)):
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"ok": True}
