from pydantic import BaseModel
from typing import Optional


class MatiereBase(BaseModel):
    nom: str
    niveau_id: Optional[int] = None
    enseignant_id: Optional[int] = None


class MatiereCreate(MatiereBase):
    pass


class MatiereRead(MatiereBase):
    id: int

    model_config = {"from_attributes": True}


class MatiereUpdate(BaseModel):
    nom: Optional[str] = None
    code: Optional[str] = None
    niveau_id: Optional[int] = None
    enseignant_id: Optional[int] = None
    departement_id: Optional[int] = None
