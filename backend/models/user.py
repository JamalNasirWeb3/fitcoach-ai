from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
import enum

from database import Base


class FitnessGoal(str, enum.Enum):
    lose_weight = "lose_weight"
    build_muscle = "build_muscle"
    improve_longevity = "improve_longevity"
    general_fitness = "general_fitness"


class ActivityLevel(str, enum.Enum):
    sedentary = "sedentary"
    lightly_active = "lightly_active"
    moderately_active = "moderately_active"
    very_active = "very_active"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)

    # Physical stats
    age = Column(Integer)
    weight_kg = Column(Float)
    height_cm = Column(Float)
    gender = Column(String)
    activity_level = Column(Enum(ActivityLevel))
    fitness_goal = Column(Enum(FitnessGoal))
    dietary_restrictions = Column(String)  # comma-separated, e.g. "vegan,gluten-free"

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
