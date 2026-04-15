from pydantic import BaseModel, EmailStr
from typing import Optional
from models.user import FitnessGoal, ActivityLevel


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserProfileUpdate(BaseModel):
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    gender: Optional[str] = None
    activity_level: Optional[ActivityLevel] = None
    fitness_goal: Optional[FitnessGoal] = None
    dietary_restrictions: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    gender: Optional[str] = None
    activity_level: Optional[ActivityLevel] = None
    fitness_goal: Optional[FitnessGoal] = None
    dietary_restrictions: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
