#!/bin/bash

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build the application
echo "🔨 Building application..."
bun run build

# Verify build output
echo "🔍 Verifying build output..."
ls -la dist/

# Check if index.html exists
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found in dist/"
else
    echo "❌ index.html NOT found in dist/"
    exit 1
fi

# Check if _redirects exists
if [ -f "dist/_redirects" ]; then
    echo "✅ _redirects found in dist/"
else
    echo "⚠️ _redirects NOT found in dist/"
fi

echo "✅ Build completed successfully!"