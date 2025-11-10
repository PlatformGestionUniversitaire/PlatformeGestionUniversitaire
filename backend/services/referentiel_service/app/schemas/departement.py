from pydantic import BaseModel


class DepartementBase(BaseModel):
    nom: str


class DepartementCreate(DepartementBase):
    pass


class DepartementRead(DepartementBase):
    id: int

    model_config = {"from_attributes": True}
