from sqlalchemy.orm import Session
from app.models.etudiant import Etudiant
from app.schemas.etudiant import EtudiantCreate


def get_etudiant(db: Session, etudiant_id: int):
    return db.query(Etudiant).filter(Etudiant.id == etudiant_id).first()


def get_etudiants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Etudiant).offset(skip).limit(limit).all()


def create_etudiant(db: Session, etudiant: EtudiantCreate):
    db_obj = Etudiant(nom=etudiant.nom, prenom=etudiant.prenom, email=etudiant.email, groupe_id=etudiant.groupe_id, specialite_id=etudiant.specialite_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_etudiant(db: Session, etudiant_id: int):
    obj = db.query(Etudiant).filter(Etudiant.id == etudiant_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


def update_etudiant(db: Session, etudiant_id: int, patch: dict):
    obj = db.query(Etudiant).filter(Etudiant.id == etudiant_id).first()
    if not obj:
        return None
    for k, v in patch.items():
        if hasattr(obj, k) and v is not None:
            setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
