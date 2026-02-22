import requests
import json

BASE_URL = "http://localhost:8000"

def check_access(name, headers=None):
    try:
        response = requests.get(f"{BASE_URL}/services", headers=headers)
        print(f"[{name}] /services -> {response.status_code}")
        if response.status_code == 503:
            print(f"[{name}] Message: {response.json().get('detail')}")
    except Exception as e:
        print(f"[{name}] Error: {e}")

print("--- Test de Maintenance Mode ---")
print("1. Accès Public (Non-authentifié)")
check_access("Public")

# To test as admin/user, we'd need a token. 
# Since I can't easily get a valid token without user interaction here, 
# I rely on the fact that 'check_maintenance_mode' allows admin role.

print("\nNote: Si le serveur est en maintenance, le Public doit recevoir 503.")
print("Si le serveur n'est PAS en maintenance, il doit recevoir 200.")
