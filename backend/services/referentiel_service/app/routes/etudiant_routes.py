from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.etudiant import EtudiantCreate, EtudiantRead
from app.crud.etudiant_crud import get_etudiant, get_etudiants, create_etudiant, delete_etudiant
from app.core.database import get_db
from app.crud.etudiant_crud import update_etudiant

router = APIRouter()

@router.get("/", response_model=List[EtudiantRead])
def list_etudiants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_etudiants(db, skip=skip, limit=limit)

@router.post("/", response_model=EtudiantRead)
def create(e: EtudiantCreate, db: Session = Depends(get_db)):
    return create_etudiant(db, e)

@router.get("/{etudiant_id}", response_model=EtudiantRead)
def read(etudiant_id: int, db: Session = Depends(get_db)):
    obj = get_etudiant(db, etudiant_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Etudiant not found")
    return obj

@router.delete("/{etudiant_id}", response_model=EtudiantRead)
def delete(e_id: int, db: Session = Depends(get_db)):
    obj = delete_etudiant(db, e_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Etudiant not found")
    return obj


@router.patch("/{etudiant_id}", response_model=EtudiantRead)
def patch(etudiant_id: int, patch: EtudiantCreate, db: Session = Depends(get_db)):
    obj = update_etudiant(db, etudiant_id, patch.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Etudiant not found")
    return obj
