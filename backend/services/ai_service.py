import json
import re
import anthropic
from models.user import User
from config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
MODEL = "claude-opus-4-6"


def _parse_json(text: str) -> dict:
    # Strip markdown code fences if present
    text = re.sub(r"^```(?:json)?\s*", "", text.strip())
    text = re.sub(r"\s*```$", "", text.strip())
    return json.loads(text)


def _user_context(user: User) -> str:
    return (
        f"User profile: {user.full_name}, age {user.age}, "
        f"weight {user.weight_kg}kg, height {user.height_cm}cm, "
        f"gender {user.gender}, activity level: {user.activity_level}, "
        f"fitness goal: {user.fitness_goal}, "
        f"dietary restrictions: {user.dietary_restrictions or 'none'}."
    )


def generate_workout_plan(user: User, duration_weeks: int, sessions_per_week: int, notes: str = "") -> dict:
    prompt = f"""
{_user_context(user)}

Create a {duration_weeks}-week workout plan with {sessions_per_week} sessions per week.
{f'Additional notes: {notes}' if notes else ''}

Respond ONLY with valid JSON in this exact structure:
{{
  "title": "Plan title",
  "weeks": [
    {{
      "week": 1,
      "sessions": [
        {{
          "day": "Monday",
          "focus": "Upper Body",
          "exercises": [
            {{"name": "Exercise", "sets": 3, "reps": "8-10", "rest_seconds": 60, "notes": ""}}
          ]
        }}
      ]
    }}
  ]
}}
"""
    message = client.messages.create(
        model=MODEL,
        max_tokens=8096,
        messages=[{"role": "user", "content": prompt}],
    )
    return _parse_json(message.content[0].text)


def generate_meal_plan(user: User, notes: str = "") -> dict:
    prompt = f"""
{_user_context(user)}

Create a 7-day personalized meal plan optimized for the user's fitness goal.
{f'Additional notes: {notes}' if notes else ''}

Respond ONLY with valid JSON in this exact structure:
{{
  "title": "Plan title",
  "daily_calories": 2000,
  "macros": {{"protein_g": 150, "carbs_g": 200, "fat_g": 65}},
  "days": [
    {{
      "day": "Monday",
      "meals": [
        {{
          "meal": "Breakfast",
          "name": "Meal name",
          "ingredients": ["item 1", "item 2"],
          "calories": 500,
          "protein_g": 30,
          "carbs_g": 50,
          "fat_g": 15
        }}
      ]
    }}
  ]
}}
"""
    message = client.messages.create(
        model=MODEL,
        max_tokens=8096,
        messages=[{"role": "user", "content": prompt}],
    )
    return _parse_json(message.content[0].text)
