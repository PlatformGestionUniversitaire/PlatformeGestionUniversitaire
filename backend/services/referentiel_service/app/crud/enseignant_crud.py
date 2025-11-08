from sqlalchemy.orm import Session
from app.models.enseignant import Enseignant
from app.schemas.enseignant import EnseignantCreate


def get_enseignant(db: Session, enseignant_id: int):
    return db.query(Enseignant).filter(Enseignant.id == enseignant_id).first()


def get_enseignants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Enseignant).offset(skip).limit(limit).all()


def create_enseignant(db: Session, enseignant: EnseignantCreate):
    db_obj = Enseignant(nom=enseignant.nom, prenom=enseignant.prenom, email=enseignant.email, departement_id=enseignant.departement_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_enseignant(db: Session, enseignant_id: int):
    obj = db.query(Enseignant).filter(Enseignant.id == enseignant_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


def update_enseignant(db: Session, enseignant_id: int, patch: dict):
    obj = db.query(Enseignant).filter(Enseignant.id == enseignant_id).first()
    if not obj:
        return None
    for k, v in patch.items():
        if hasattr(obj, k) and v is not None:
            setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
