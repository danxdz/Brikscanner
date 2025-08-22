#!/bin/bash

echo "Starting Vercel build process..."

# Ensure @expo/metro-runtime is installed
echo "Installing @expo/metro-runtime explicitly..."
npm install @expo/metro-runtime@~3.2.3 --legacy-peer-deps

# Verify installation
echo "Verifying @expo/metro-runtime installation..."
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

echo "Vercel build process completed!"