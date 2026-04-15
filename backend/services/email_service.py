import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

from config import settings


def send_plan_email(to_email: str, user_name: str, plan_title: str, pdf_bytes: bytes, plan_type: str) -> None:
    msg = MIMEMultipart()
    msg["From"] = settings.gmail_user
    msg["To"] = to_email
    msg["Subject"] = f"Your {plan_title} — FitCoach AI"

    msg.attach(MIMEText(f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #059669;">FitCoach AI</h2>
        <p>Hi {user_name},</p>
        <p>Your <strong>{plan_title}</strong> is ready! Find it attached as a PDF.</p>
        <p style="color: #6b7280; font-size: 13px;">Stay consistent and enjoy the journey.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #9ca3af; font-size: 11px;">FitCoach AI — Personalized fitness powered by AI</p>
    </div>
    """, "html"))

    attachment = MIMEBase("application", "octet-stream")
    attachment.set_payload(pdf_bytes)
    encoders.encode_base64(attachment)
    attachment.add_header("Content-Disposition", f'attachment; filename="{plan_type}_plan.pdf"')
    msg.attach(attachment)

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.gmail_user, settings.gmail_app_password)
        server.sendmail(settings.gmail_user, to_email, msg.as_string())
