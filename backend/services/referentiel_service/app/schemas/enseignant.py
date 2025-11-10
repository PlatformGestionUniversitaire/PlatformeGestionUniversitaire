from pydantic import BaseModel, EmailStr
from typing import Optional


class EnseignantBase(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    departement_id: Optional[int] = None


class EnseignantCreate(EnseignantBase):
    pass


class EnseignantRead(EnseignantBase):
    id: int
    model_config = {"from_attributes": True}
