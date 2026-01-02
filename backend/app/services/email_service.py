"""
EmailService - Email sending service (mocked).
Maps to EmailService in class diagram.
"""
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """
    Service for sending emails.
    Currently mocked - logs instead of sending real emails.
    """
    
    def __init__(
        self,
        smtp_host: str = "localhost",
        smtp_port: int = 587,
        sender_email: str = "noreply@kickoff.com",
        sender_name: str = "Kick-off Platform",
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_name = sender_name
    
    async def send_verification_email(self, email: str, verification_token: str) -> bool:
        """Send email verification link (mocked)."""
        logger.info(f"[MOCK EMAIL] Verification email to {email} with token: {verification_token}")
        return True
    
    async def send_password_reset_email(self, email: str, reset_token: str) -> bool:
        """Send password reset link (mocked)."""
        logger.info(f"[MOCK EMAIL] Password reset to {email} with token: {reset_token}")
        return True
    
    async def send_notification_email(self, email: str, subject: str, body: str) -> bool:
        """Send general notification email (mocked)."""
        logger.info(f"[MOCK EMAIL] To: {email}, Subject: {subject}")
        return True
    
    def _build_email_template(self, template_name: str, data: dict) -> str:
        """Build email from template (stub)."""
        return f"Template: {template_name}, Data: {data}"
    
    async def _send(self, to: str, subject: str, body: str) -> bool:
        """Send email via SMTP (mocked)."""
        logger.info(f"[MOCK SMTP] Sending to {to}: {subject}")
        return True
