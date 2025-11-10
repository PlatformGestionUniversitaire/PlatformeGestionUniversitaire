from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.enseignant import EnseignantCreate, EnseignantRead
from app.crud.enseignant_crud import get_enseignant, get_enseignants, create_enseignant, delete_enseignant
from app.core.database import get_db
from app.schemas.enseignant import EnseignantCreate
from app.crud.enseignant_crud import update_enseignant

router = APIRouter()

@router.get("/", response_model=List[EnseignantRead])
def list_enseignants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_enseignants(db, skip=skip, limit=limit)

@router.post("/", response_model=EnseignantRead)
def create(e: EnseignantCreate, db: Session = Depends(get_db)):
    return create_enseignant(db, e)

@router.get("/{enseignant_id}", response_model=EnseignantRead)
def read(enseignant_id: int, db: Session = Depends(get_db)):
    obj = get_enseignant(db, enseignant_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Enseignant not found")
    return obj

@router.delete("/{enseignant_id}", response_model=EnseignantRead)
def delete(e_id: int, db: Session = Depends(get_db)):
    obj = delete_enseignant(db, e_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Enseignant not found")
    return obj


@router.patch("/{enseignant_id}", response_model=EnseignantRead)
def patch(enseignant_id: int, patch: EnseignantCreate, db: Session = Depends(get_db)):
    obj = update_enseignant(db, enseignant_id, patch.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Enseignant not found")
    return obj
