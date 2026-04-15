from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.nutrition import MealPlan
from schemas.nutrition import MealPlanRequest, MealPlanOut
from services.auth import get_current_user
from services.ai_service import generate_meal_plan
from services.pdf_service import generate_meal_pdf
from services.email_service import send_plan_email


class EmailRequest(BaseModel):
    email: EmailStr | None = None

router = APIRouter(prefix="/nutrition", tags=["nutrition"])


@router.post("/generate", response_model=MealPlanOut)
def generate(
    request: MealPlanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.fitness_goal or not current_user.weight_kg:
        raise HTTPException(status_code=400, detail="Complete your profile before generating a meal plan")

    plan_data = generate_meal_plan(current_user, request.additional_notes or "")
    macros = plan_data.get("macros", {})

    plan = MealPlan(
        user_id=current_user.id,
        title=plan_data.get("title", "My Meal Plan"),
        daily_calories=plan_data.get("daily_calories"),
        protein_g=macros.get("protein_g"),
        carbs_g=macros.get("carbs_g"),
        fat_g=macros.get("fat_g"),
        plan_data=plan_data,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/", response_model=list[MealPlanOut])
def list_plans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()


@router.get("/{plan_id}", response_model=MealPlanOut)
def get_plan(plan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(MealPlan).filter(MealPlan.id == plan_id, MealPlan.user_id == current_user.id).first()
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
    plan = db.query(MealPlan).filter(MealPlan.id == plan_id, MealPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    pdf = generate_meal_pdf(
        plan.plan_data, plan.title, plan.daily_calories,
        plan.protein_g, plan.carbs_g, plan.fat_g, current_user.full_name,
    )
    to_email = body.email or current_user.email
    send_plan_email(to_email, current_user.full_name, plan.title, pdf, "meal")
    return {"message": f"Plan sent to {to_email}"}
