from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    role: str
    login: str

class UserCreate(UserBase):
    mdp: str

class UserLogin(BaseModel):
    login: str
    mdp: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
