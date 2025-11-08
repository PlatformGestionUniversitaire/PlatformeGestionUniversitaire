from sqlalchemy.orm import Session
from app.models.matiere import Matiere
from app.schemas.matiere import MatiereCreate


def get_matiere(db: Session, matiere_id: int):
    return db.query(Matiere).filter(Matiere.id == matiere_id).first()


def get_matieres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Matiere).offset(skip).limit(limit).all()


def create_matiere(db: Session, matiere: MatiereCreate):
    db_obj = Matiere(nom=matiere.nom, niveau_id=matiere.niveau_id, enseignant_id=matiere.enseignant_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_matiere(db: Session, matiere_id: int):
    obj = db.query(Matiere).filter(Matiere.id == matiere_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


def update_matiere(db: Session, matiere_id: int, patch: dict):
    obj = db.query(Matiere).filter(Matiere.id == matiere_id).first()
    if not obj:
        return None
    for k, v in patch.items():
        if hasattr(obj, k) and v is not None:
            setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
