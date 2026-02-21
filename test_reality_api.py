import requests
import json

BASE_URL = "http://localhost:8000"

def test_reality():
    login_payload = {
        "email": "oubraimyassir@gmail.com",
        "password": "Jad.1233"
    }
    
    try:
        login_res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        login_res.raise_for_status()
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 1. Check Admin Stats
        stats_res = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        print("Admin Stats:", json.dumps(stats_res.json(), indent=2))
        
        # 2. Check Admin Users
        users_res = requests.get(f"{BASE_URL}/admin/users", headers=headers)
        users = users_res.json()
        print("\nAdmin Users:")
        for u in users:
            print(f"- {u['name']} ({u['email']}): Status={u['is_active']}, Orders={u['order_count']}, Profit={u['total_profit']:.2f} €")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_reality()
