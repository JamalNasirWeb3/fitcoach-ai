import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER

EMERALD = colors.HexColor("#059669")
BLUE = colors.HexColor("#2563eb")
LIGHT_GRAY = colors.HexColor("#f3f4f6")
DARK_GRAY = colors.HexColor("#374151")


def _base_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("AppTitle", fontSize=24, textColor=EMERALD, spaceAfter=4, alignment=TA_CENTER, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("PlanTitle", fontSize=16, textColor=DARK_GRAY, spaceAfter=2, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("SectionHeader", fontSize=12, textColor=EMERALD, spaceBefore=10, spaceAfter=4, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("SubHeader", fontSize=10, textColor=DARK_GRAY, spaceBefore=6, spaceAfter=2, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle("Body", fontSize=9, textColor=DARK_GRAY, fontName="Helvetica"))
    styles.add(ParagraphStyle("Meta", fontSize=9, textColor=colors.HexColor("#6b7280"), fontName="Helvetica"))
    return styles


def generate_workout_pdf(plan_data: dict, title: str, duration_weeks: int, sessions_per_week: int, user_name: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=1.5*cm, bottomMargin=1.5*cm,
                            leftMargin=2*cm, rightMargin=2*cm)
    styles = _base_styles()
    story = []

    story.append(Paragraph("FitCoach AI", styles["AppTitle"]))
    story.append(HRFlowable(width="100%", thickness=1, color=EMERALD))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph(title, styles["PlanTitle"]))
    story.append(Paragraph(f"Prepared for: {user_name}  ·  {duration_weeks} weeks  ·  {sessions_per_week} sessions/week", styles["Meta"]))
    story.append(Spacer(1, 0.6*cm))

    for week in plan_data.get("weeks", []):
        story.append(Paragraph(f"Week {week['week']}", styles["SectionHeader"]))
        story.append(HRFlowable(width="100%", thickness=0.5, color=EMERALD))

        for session in week.get("sessions", []):
            story.append(Paragraph(f"{session['day']}  —  {session.get('focus', '')}", styles["SubHeader"]))

            table_data = [["Exercise", "Sets", "Reps", "Rest"]]
            for ex in session.get("exercises", []):
                note = f" ({ex['notes']})" if ex.get("notes") else ""
                table_data.append([
                    ex["name"] + note,
                    str(ex["sets"]),
                    str(ex["reps"]),
                    f"{ex['rest_seconds']}s",
                ])

            table = Table(table_data, colWidths=[9*cm, 2*cm, 2.5*cm, 2.5*cm])
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), EMERALD),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e5e7eb")),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ]))
            story.append(table)
            story.append(Spacer(1, 0.3*cm))

    doc.build(story)
    return buffer.getvalue()


def generate_meal_pdf(plan_data: dict, title: str, daily_calories: float, protein_g: float,
                      carbs_g: float, fat_g: float, user_name: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=1.5*cm, bottomMargin=1.5*cm,
                            leftMargin=2*cm, rightMargin=2*cm)
    styles = _base_styles()
    story = []

    story.append(Paragraph("FitCoach AI", styles["AppTitle"]))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph(title, styles["PlanTitle"]))
    story.append(Paragraph(f"Prepared for: {user_name}", styles["Meta"]))

    macros_data = [["Daily Calories", "Protein", "Carbs", "Fat"],
                   [f"{daily_calories} kcal", f"{protein_g}g", f"{carbs_g}g", f"{fat_g}g"]]
    macros_table = Table(macros_data, colWidths=[4*cm, 3.5*cm, 3.5*cm, 3.5*cm])
    macros_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e5e7eb")),
    ]))
    story.append(Spacer(1, 0.4*cm))
    story.append(macros_table)
    story.append(Spacer(1, 0.6*cm))

    for day in plan_data.get("days", []):
        story.append(Paragraph(day["day"], styles["SectionHeader"]))
        story.append(HRFlowable(width="100%", thickness=0.5, color=BLUE))

        for meal in day.get("meals", []):
            story.append(Paragraph(f"{meal['meal']}  —  {meal['name']}", styles["SubHeader"]))
            story.append(Paragraph(", ".join(meal.get("ingredients", [])), styles["Body"]))
            story.append(Paragraph(
                f"{meal['calories']} kcal  ·  P: {meal['protein_g']}g  ·  C: {meal['carbs_g']}g  ·  F: {meal['fat_g']}g",
                styles["Meta"]
            ))
            story.append(Spacer(1, 0.2*cm))

    doc.build(story)
    return buffer.getvalue()
