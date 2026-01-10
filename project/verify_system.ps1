#!/usr/bin/env powershell
<#
Quick test to verify RAG is responding to chat queries
#>

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RAG SYSTEM VERIFICATION TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if frontend is running
Write-Host "1. Checking if frontend is accessible..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   [OK] Frontend running on http://localhost:3001" -ForegroundColor Green
    }
} catch {
    Write-Host "   [ERROR] Frontend not accessible - Start with: npm run dev" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Direct RAG query
Write-Host "2. Testing RAG query directly..."
try {
    $output = & python -m backend.app.services.rag_query "What is artificial intelligence?" 3 2>&1
    $data = $output | ConvertFrom-Json
    
    if ($data.status -eq "success") {
        Write-Host "   [OK] RAG returned: '$($data.answer.Substring(0, 60))...'" -ForegroundColor Green
        Write-Host "   [OK] Retrieved $($data.retrieved_documents.Length) documents" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] RAG error: $($data.status)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   [ERROR] RAG query failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUCCESS! System is fully operational" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Open http://localhost:3001 in your browser"
Write-Host "2. Go to /chat page"
Write-Host "3. Ask a question about machine learning"
Write-Host ""
