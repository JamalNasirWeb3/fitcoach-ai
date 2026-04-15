from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON

from database import Base


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    daily_calories = Column(Float)
    protein_g = Column(Float)
    carbs_g = Column(Float)
    fat_g = Column(Float)
    # Full AI-generated plan: {days: [{day, meals: [{name, ingredients, calories, protein, carbs, fat}]}]}
    plan_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
