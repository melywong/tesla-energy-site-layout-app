#!/bin/bash
set -e

echo "Starting Tesla Energy Site Layout App..."

# Check dependencies
for cmd in python3 pip3 node npm; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: $cmd is required but not installed."
    exit 1
  fi
done

# Start backend
echo "Starting backend on port 8001..."
cd backend
pip3 install -r requirements.txt -q
uvicorn main:app --port 8001 --reload &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting frontend on port 8000..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Backend running on http://localhost:8001"
echo "Frontend running on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both services."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
