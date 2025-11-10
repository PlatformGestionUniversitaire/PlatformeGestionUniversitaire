from sqlalchemy.orm import Session
from app.models.departement import Departement
from app.schemas.departement import DepartementCreate


def get_departement(db: Session, departement_id: int):
    return db.query(Departement).filter(Departement.id == departement_id).first()


def get_departements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Departement).offset(skip).limit(limit).all()


def create_departement(db: Session, departement: DepartementCreate):
    db_obj = Departement(nom=departement.nom)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_departement(db: Session, departement_id: int, nom: str):
    obj = db.query(Departement).filter(Departement.id == departement_id).first()
    if not obj:
        return None
    obj.nom = nom
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_departement(db: Session, departement_id: int):
    obj = db.query(Departement).filter(Departement.id == departement_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj
