#!/bin/bash
# SMS API Testing Script

BASE_URL="https://gov.school.edu.sl/api/sis"
API_KEY="sis_secret_key_change_this_to_something_secure_12345"

echo "========================================"
echo "Testing SMS API Endpoints for SIS"
echo "========================================"
echo ""

# Test 1: Dashboard Summary
echo "1. Testing Dashboard Summary..."
curl -s -X GET "${BASE_URL}/dashboard/summary" \
  -H "X-SIS-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo ""
echo ""

# Test 2: Regional Breakdown
echo "2. Testing Regional Breakdown..."
curl -s -X GET "${BASE_URL}/dashboard/regions" \
  -H "X-SIS-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo ""
echo ""

# Test 3a: Authentication with Email
echo "3a. Testing Authentication with Email (RAW RESPONSE)..."
curl -s -X POST "${BASE_URL}/auth/check" \
  -H "X-SIS-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "student@example.com",
    "password": "password123"
  }'
echo ""
echo ""

# Test 3b: Authentication with Phone Number
echo "3b. Testing Authentication with Phone Number (RAW RESPONSE)..."
curl -s -X POST "${BASE_URL}/auth/check" \
  -H "X-SIS-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "077601707",
    "password": "123456"
  }'
echo ""
echo ""

# Test 4: Test with wrong API key (should fail with 401)
echo "4. Testing with Invalid API Key (should return 401)..."
curl -s -X GET "${BASE_URL}/dashboard/summary" \
  -H "X-SIS-API-KEY: wrong_key" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed as expected"
echo ""
echo ""

echo "========================================"
echo "Testing Complete"
echo "========================================"
