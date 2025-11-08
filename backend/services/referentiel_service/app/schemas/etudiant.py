from pydantic import BaseModel, EmailStr
from typing import Optional


class EtudiantBase(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    groupe_id: Optional[int] = None
    specialite_id: Optional[int] = None


class EtudiantCreate(EtudiantBase):
    pass


class EtudiantRead(EtudiantBase):
    id: int
    model_config = {"from_attributes": True}
