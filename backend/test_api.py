import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing backend connection...")
    
    # 1. Test Health endpoint
    try:
        res = requests.get(f"{BASE_URL}/")
        print(f"Health check: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Failed to connect to backend: {e}")
        return

    # 2. Test ToS Report endpoint (Unauthorized without token, but checks route existence)
    try:
        res = requests.post(f"{BASE_URL}/ai/report", json={"tos_text": "test"})
        print(f"ToS Report route (no auth): {res.status_code} (Expected 401)")
    except Exception as e:
        print(f"ToS Report test failed: {e}")

    # 3. Test Cards endpoint (Unauthorized)
    try:
        res = requests.get(f"{BASE_URL}/cards/")
        print(f"Get Cards route (no auth): {res.status_code} (Expected 401)")
    except Exception as e:
        print(f"Get Cards test failed: {e}")

if __name__ == "__main__":
    test_api()
