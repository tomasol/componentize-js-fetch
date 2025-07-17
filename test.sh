#!/usr/bin/env bash
set -ex

# Run npm install or install specific version of componentize-js
if [ -z "$1" ]; then
  npm install
else
  npm i --include=dev @bytecodealliance/componentize-js@"$1"
fi

# Build the project
npm run build

# Start server in background and capture PID
npm run serve &
SERVER_PID=$!
trap "kill $SERVER_PID" EXIT

sleep 5

# Run curl and check exit code
npm run curl
if [ $? -ne 0 ]; then
  echo "curl command failed."
  exit 1
fi
