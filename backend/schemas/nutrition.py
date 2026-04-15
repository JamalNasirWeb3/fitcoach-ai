from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MealPlanRequest(BaseModel):
    additional_notes: Optional[str] = None


class MealPlanOut(BaseModel):
    id: int
    user_id: int
    title: str
    daily_calories: Optional[float]
    protein_g: Optional[float]
    carbs_g: Optional[float]
    fat_g: Optional[float]
    plan_data: dict
    created_at: datetime

    class Config:
        from_attributes = True
