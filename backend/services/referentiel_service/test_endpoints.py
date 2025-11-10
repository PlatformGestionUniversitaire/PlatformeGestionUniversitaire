from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print('GET /openapi.json')
resp = client.get('/openapi.json')
print(resp.status_code)
try:
    openapi = resp.json().get('openapi')
except Exception:
    openapi = None
print('openapi:', openapi)

print('\nGET /departements')
resp = client.get('/departements')
print(resp.status_code)
print(resp.json())

print('\nPOST /departements')
resp = client.post('/departements', json={'nom': 'Informatique'})
print(resp.status_code)
print(resp.json())

print('\nGET /departements (after create)')
resp = client.get('/departements')
print(resp.status_code)
print(resp.json())

print('\nGET /enseignants')
resp = client.get('/enseignants')
print(resp.status_code)
print(resp.json())

print('\nPOST /enseignants')
resp = client.post('/enseignants', json={
    'nom': 'Dupont', 'prenom': 'Jean', 'email': 'j.dupont@example.com', 'departement_id': 2
})
print(resp.status_code)
print(resp.json())

print('\nGET /enseignants (after create)')
resp = client.get('/enseignants')
print(resp.status_code)
print(resp.json())

print('\nGET /matieres')
resp = client.get('/matieres')
print(resp.status_code)
print(resp.json())

print('\nPOST /matieres')
resp = client.post('/matieres', json={
    'nom': 'Programmation', 'code': 'INF101', 'niveau_id': 1, 'enseignant_id': 1, 'departement_id': 2
})
print(resp.status_code)
print(resp.json())

print('\nGET /matieres (after create)')
resp = client.get('/matieres')
print(resp.status_code)
print(resp.json())

print('\nGET /etudiants')
resp = client.get('/etudiants')
print(resp.status_code)
print(resp.json())

print('\nPOST /etudiants')
resp = client.post('/etudiants', json={
    'nom': 'Martin', 'prenom': 'Alice', 'email': 'alice.martin@example.com', 'groupe_id': 1, 'specialite_id': 1
})
print(resp.status_code)
print(resp.json())

print('\nGET /etudiants (after create)')
resp = client.get('/etudiants')
print(resp.status_code)
print(resp.json())
