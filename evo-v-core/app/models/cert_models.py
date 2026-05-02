from pydantic import BaseModel


class CertificateRecord(BaseModel):
    cert_id: str
    issued_to: str
    issued_at: str
