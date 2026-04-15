from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON

from database import Base


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    duration_weeks = Column(Integer, default=4)
    sessions_per_week = Column(Integer, default=3)
    # Full AI-generated plan stored as JSON: {weeks: [{day, exercises: [{name, sets, reps, rest}]}]}
    plan_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
