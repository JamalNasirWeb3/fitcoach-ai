# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI-powered fitness coaching web app helping users lose weight, build muscle, and increase longevity. Uses Claude API to generate personalized workout and meal plans.

## Tech Stack

- **Frontend**: Next.js (TypeScript + Tailwind CSS) — `frontend/`
- **Backend**: Python FastAPI — `backend/`
- **Database**: PostgreSQL via SQLAlchemy ORM
- **AI**: Anthropic Claude API (`claude-opus-4-6`) for plan generation

## Backend Setup & Commands

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in all required vars (see below)

# Run dev server
uvicorn main:app --reload

# API docs available at http://localhost:8000/docs
```

Required `.env` variables (`.env.example` is incomplete — also add):
```
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

### Database migrations (Alembic)

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1
```

Note: `main.py` calls `Base.metadata.create_all()` on startup, so tables are auto-created in dev without Alembic. Use Alembic for production schema changes.

## Frontend Setup & Commands

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

**Important**: See `frontend/AGENTS.md` before writing any frontend code — this Next.js version has breaking API changes from older versions. Read the relevant guide in `node_modules/next/dist/docs/` first.

## Architecture

### Backend (`backend/`)

- `main.py` — FastAPI app; mounts all routers; CORS configured via `settings.allowed_origins` (comma-separated)
- `config.py` — Pydantic `Settings` from `.env`: `database_url`, `secret_key`, `anthropic_api_key`, `gmail_user`, `gmail_app_password`, `allowed_origins`
- `database.py` — SQLAlchemy engine, `SessionLocal`, `Base`, `get_db` dependency
- `models/` — ORM models: `User` (with `FitnessGoal` + `ActivityLevel` enums), `WorkoutPlan`, `MealPlan`
- `schemas/` — Pydantic request/response schemas matching the models
- `routers/` — Route handlers: `auth`, `users`, `workout`, `nutrition`
- `services/auth.py` — JWT creation/validation, bcrypt hashing, `get_current_user` FastAPI dependency
- `services/ai_service.py` — Prompts Claude and parses the JSON response; strips markdown fences via `_parse_json`
- `services/pdf_service.py` — Generates PDF bytes using ReportLab for workout and meal plans
- `services/email_service.py` — Sends plan PDFs as email attachments via Gmail SMTP (port 587/STARTTLS)

### AI Plan Generation Flow

1. Client calls `POST /workout/generate` or `POST /nutrition/generate` (authenticated)
2. Router validates profile is complete (`fitness_goal` and `weight_kg` required)
3. `ai_service.py` builds a prompt with user stats and calls `claude-opus-4-6` (max 8096 tokens)
4. Claude returns structured JSON; it's saved to PostgreSQL and returned to client

**Workout `plan_data` shape** stored in `WorkoutPlan.plan_data` (JSON column):
```json
{"title": "...", "weeks": [{"week": 1, "sessions": [{"day": "Monday", "focus": "Upper Body", "exercises": [{"name": "...", "sets": 3, "reps": "8-10", "rest_seconds": 60, "notes": ""}]}]}]}
```

**Meal `plan_data` shape** stored in `MealPlan.plan_data` (JSON column):
```json
{"title": "...", "daily_calories": 2000, "macros": {"protein_g": 150, "carbs_g": 200, "fat_g": 65}, "days": [{"day": "Monday", "meals": [{"meal": "Breakfast", "name": "...", "ingredients": [], "calories": 500, "protein_g": 30, "carbs_g": 50, "fat_g": 15}]}]}
```

### Auth Flow

JWT bearer tokens. Login via `POST /auth/login` (OAuth2 password form — `username` field holds the email). Token sent as `Authorization: Bearer <token>`. JWT `sub` claim holds `user_id` as a string.

### Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET/PATCH | `/users/me` | Get/update profile |
| POST | `/workout/generate` | AI-generate workout plan |
| GET | `/workout/` | List user's workout plans |
| GET | `/workout/{id}` | Get single workout plan |
| POST | `/workout/{id}/email` | Email workout plan PDF |
| POST | `/nutrition/generate` | AI-generate meal plan |
| GET | `/nutrition/` | List user's meal plans |
| GET | `/nutrition/{id}` | Get single meal plan |
| POST | `/nutrition/{id}/email` | Email meal plan PDF |
| GET | `/health` | Health check |
