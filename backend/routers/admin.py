from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database import get_db
from models.user import User
from models.workout import WorkoutPlan
from models.nutrition import MealPlan
from services.auth import get_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminUserSummary(BaseModel):
    id: int
    email: str
    full_name: str
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    fitness_goal: Optional[str] = None
    activity_level: Optional[str] = None
    created_at: datetime
    workout_count: int
    meal_count: int

    class Config:
        from_attributes = True


class AdminWorkoutSummary(BaseModel):
    id: int
    title: str
    duration_weeks: int
    sessions_per_week: int
    created_at: datetime

    class Config:
        from_attributes = True


class AdminMealSummary(BaseModel):
    id: int
    title: str
    daily_calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AdminUserDetail(AdminUserSummary):
    height_cm: Optional[float] = None
    gender: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    workouts: list[AdminWorkoutSummary]
    meals: list[AdminMealSummary]


@router.get("/users", response_model=list[AdminUserSummary])
def list_users(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []
    for user in users:
        workout_count = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user.id).count()
        meal_count = db.query(MealPlan).filter(MealPlan.user_id == user.id).count()
        result.append(AdminUserSummary(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            age=user.age,
            weight_kg=user.weight_kg,
            fitness_goal=user.fitness_goal,
            activity_level=user.activity_level,
            created_at=user.created_at,
            workout_count=workout_count,
            meal_count=meal_count,
        ))
    return result


@router.get("/users/{user_id}", response_model=AdminUserDetail)
def get_user_detail(user_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    workouts = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.created_at.desc()).all()
    meals = db.query(MealPlan).filter(MealPlan.user_id == user_id).order_by(MealPlan.created_at.desc()).all()

    return AdminUserDetail(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        age=user.age,
        weight_kg=user.weight_kg,
        height_cm=user.height_cm,
        gender=user.gender,
        fitness_goal=user.fitness_goal,
        activity_level=user.activity_level,
        dietary_restrictions=user.dietary_restrictions,
        created_at=user.created_at,
        workout_count=len(workouts),
        meal_count=len(meals),
        workouts=[AdminWorkoutSummary.model_validate(w) for w in workouts],
        meals=[AdminMealSummary.model_validate(m) for m in meals],
    )
