from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WorkoutPlanRequest(BaseModel):
    duration_weeks: int = 4
    sessions_per_week: int = 3
    additional_notes: Optional[str] = None


class WorkoutPlanOut(BaseModel):
    id: int
    user_id: int
    title: str
    duration_weeks: int
    sessions_per_week: int
    plan_data: dict
    created_at: datetime

    class Config:
        from_attributes = True
