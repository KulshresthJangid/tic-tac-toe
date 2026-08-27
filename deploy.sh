#!/bin/bash

set -e

APP_NAME="tic-tac-toe"
SRC_PATH="/root/apps/$APP_NAME"
BUILD_PATH="$SRC_PATH/dist"
DEST_PATH="/var/www/$APP_NAME"

echo "Starting build and deploy for $APP_NAME..."

# Step 1: Navigate to project

cd "$SRC_PATH"

# Step 2: Install dependencies (if needed)

echo "Installing dependencies..."
npm install

# Step 3: Build project

echo "Building React app..."
npm run build

# Step 4: Prepare destination directory

echo "Preparing destination..."
mkdir -p "$DEST_PATH"

# Step 5: Clean old build

echo "Cleaning old build..."
rm -rf "$DEST_PATH"/*

# Step 6: Copy new build

echo "Copying new build..."
cp -r "$BUILD_PATH"/* "$DEST_PATH"/

# Step 7: Set ownership and permissions

echo "Setting permissions..."
chown -R nginx:nginx "$DEST_PATH"
chmod -R 755 "$DEST_PATH"

# Step 8: Set SELinux context (if applicable)

if command -v chcon >/dev/null 2>&1; then
echo "Setting SELinux context..."
chcon -Rt httpd_sys_content_t "$DEST_PATH" || true
fi

echo "Deployment completed successfully at $DEST_PATH"
