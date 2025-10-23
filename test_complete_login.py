#!/usr/bin/env python3
"""
COMPLETE LOGIN FLOW TEST
"""
import requests
import json

def test_complete_login_flow():
    """Test the complete login flow"""
    print('🧪 TESTING COMPLETE LOGIN FLOW')
    print('=' * 40)

    # Test 1: Login with correct credentials
    login_data = {
        'email': 'seanebones@gmail.com',
        'password': 'ResetPassword123!'
    }

    try:
        response = requests.post('https://bizbot-api.onrender.com/api/v1/auth/login', 
                               json=login_data, timeout=10)
        
        print(f'Login Status: {response.status_code}')
        
        if response.status_code == 200:
            data = response.json()
            print('✅ LOGIN SUCCESSFUL!')
            print(f'Access Token: {data.get("access_token", "N/A")[:20]}...')
            print(f'User: {data.get("user", {}).get("name", "N/A")}')
            print(f'Email: {data.get("user", {}).get("email", "N/A")}')
            print(f'Tier: {data.get("user", {}).get("tier", "N/A")}')
            print(f'Credits: ${data.get("user", {}).get("credits", 0)}')
            
            # Test 2: Use token to access protected endpoint
            token = data.get('access_token')
            if token:
                headers = {'Authorization': f'Bearer {token}'}
                
                # Test credits endpoint
                credits_response = requests.get('https://bizbot-api.onrender.com/api/v1/user/credits', 
                                              headers=headers, timeout=10)
                
                print(f'Credits Endpoint: {credits_response.status_code}')
                if credits_response.status_code == 200:
                    credits_data = credits_response.json()
                    print(f'✅ Credits Access: ${credits_data.get("balance", 0)}')
                else:
                    print(f'❌ Credits failed: {credits_response.text}')
            
            print('\n🎉 COMPLETE LOGIN FLOW WORKING!')
            return True
            
        else:
            print(f'❌ Login failed: {response.text}')
            return False
            
    except Exception as e:
        print(f'❌ Login test failed: {e}')
        return False

if __name__ == "__main__":
    success = test_complete_login_flow()
    exit(0 if success else 1)
