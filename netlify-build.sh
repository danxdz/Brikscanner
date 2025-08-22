#!/bin/bash

echo "Starting Netlify build process..."

# Clean previous builds
echo "Cleaning previous build artifacts..."
rm -rf node_modules dist package-lock.json .expo

# Install dependencies fresh
echo "Installing dependencies..."
npm install --legacy-peer-deps

# List installed packages to verify
echo "Verifying installations..."
npm ls @expo/metro-runtime

# Build the web app
echo "Building web application..."
npx expo export --platform web --output-dir dist

# Check if build was successful
if [ -d "dist" ]; then
    echo "Build successful! dist directory created."
    ls -la dist/
else
    echo "Build failed! dist directory not found."
    exit 1
fi

echo "Netlify build process completed!"