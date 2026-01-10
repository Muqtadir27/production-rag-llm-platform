#!/bin/bash

# NeuroCore RAG - Quick Start Script (Linux/macOS)
# This script sets up and runs the entire RAG system

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        NeuroCore RAG - Automated Setup & Launch            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Please install Python 3.10+ from https://www.python.org/"
    exit 1
fi

echo "✅ Python found"
python3 --version

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found"
node --version

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Installing Python Dependencies..."
echo "═══════════════════════════════════════════════════════════"
pip3 install -r backend/requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Creating data directories..."
echo "═══════════════════════════════════════════════════════════"
mkdir -p data/documents
echo "✅ Created data/documents directory"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Installing NPM Dependencies..."
echo "═══════════════════════════════════════════════════════════"
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install NPM dependencies"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Building Vector Index..."
echo "═══════════════════════════════════════════════════════════"
python3 -m backend.app.services.test_rag
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Could not build index"
    echo "Make sure documents are in data/documents/"
    echo "You can build later with: python3 -m backend.app.services.test_rag"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               ✨ Setup Complete! ✨                         ║"
echo "║                                                            ║"
echo "║  Next Steps:                                              ║"
echo "║  1. Press Enter to start the backend                      ║"
echo "║  2. Backend will run on http://localhost:8000             ║"
echo "║  3. Open another terminal and run: npm run dev            ║"
echo "║  4. Frontend will run on http://localhost:3000/chat       ║"
echo "║  5. Start asking questions! 🚀                            ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

read -p "Press Enter to start backend..."

echo ""
echo "Starting Python Backend..."
echo ""
echo "⏳ First load may take 1-2 minutes (loading LLM model)..."
echo ""
python3 -m backend.app.main
