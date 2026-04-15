from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.workout import WorkoutPlan
from schemas.workout import WorkoutPlanRequest, WorkoutPlanOut
from services.auth import get_current_user
from services.ai_service import generate_workout_plan
from services.pdf_service import generate_workout_pdf
from services.email_service import send_plan_email


class EmailRequest(BaseModel):
    email: EmailStr | None = None  # defaults to user's registered email

router = APIRouter(prefix="/workout", tags=["workout"])


@router.post("/generate", response_model=WorkoutPlanOut)
def generate(
    request: WorkoutPlanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.fitness_goal or not current_user.weight_kg:
        raise HTTPException(status_code=400, detail="Complete your profile before generating a plan")

    plan_data = generate_workout_plan(
        current_user,
        request.duration_weeks,
        request.sessions_per_week,
        request.additional_notes or "",
    )

    plan = WorkoutPlan(
        user_id=current_user.id,
        title=plan_data.get("title", "My Workout Plan"),
        duration_weeks=request.duration_weeks,
        sessions_per_week=request.sessions_per_week,
        plan_data=plan_data,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/", response_model=list[WorkoutPlanOut])
def list_plans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(WorkoutPlan).filter(WorkoutPlan.user_id == current_user.id).all()


@router.get("/{plan_id}", response_model=WorkoutPlanOut)
def get_plan(plan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id, WorkoutPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


@router.post("/{plan_id}/email")
def email_plan(
    plan_id: int,
    body: EmailRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id, WorkoutPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    pdf = generate_workout_pdf(
        plan.plan_data, plan.title, plan.duration_weeks,
        plan.sessions_per_week, current_user.full_name,
    )
    to_email = body.email or current_user.email
    send_plan_email(to_email, current_user.full_name, plan.title, pdf, "workout")
    return {"message": f"Plan sent to {to_email}"}
