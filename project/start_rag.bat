@echo off
REM NeuroCore RAG - Quick Start Script
REM This script sets up and runs the entire RAG system

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        NeuroCore RAG - Automated Setup & Launch            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

echo.
echo ═══════════════════════════════════════════════════════════
echo Installing Python Dependencies...
echo ═══════════════════════════════════════════════════════════
pip install -r backend/requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo Creating data directories...
echo ═══════════════════════════════════════════════════════════
if not exist "data\documents" mkdir data\documents
echo ✅ Created data/documents directory

echo.
echo ═══════════════════════════════════════════════════════════
echo Installing NPM Dependencies...
echo ═══════════════════════════════════════════════════════════
call npm install
if errorlevel 1 (
    echo ❌ Failed to install NPM dependencies
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo Building Vector Index...
echo ═══════════════════════════════════════════════════════════
python -m backend.app.services.test_rag
if errorlevel 1 (
    echo ⚠️  Warning: Could not build index
    echo Make sure documents are in data/documents/
    echo You can build later with: python -m backend.app.services.test_rag
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║               ✨ Setup Complete! ✨                         ║
echo ║                                                            ║
echo ║  Next Steps:                                              ║
echo ║  1. Press any key to start the backend                    ║
echo ║  2. Backend will run on http://localhost:8000             ║
echo ║  3. Open another terminal and run: npm run dev            ║
echo ║  4. Frontend will run on http://localhost:3000/chat       ║
echo ║  5. Start asking questions! 🚀                            ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause

echo.
echo Starting Python Backend...
echo.
echo ⏳ First load may take 1-2 minutes (loading LLM model)...
echo.
python -m backend.app.main
