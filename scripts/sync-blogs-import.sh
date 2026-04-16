#!/bin/bash
# Run LOCALLY to pull blog data from git and import into local DB
# Usage: npm run blogs:pull (or bash scripts/sync-blogs-import.sh)

set -e

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DB_PATH="$APP_DIR/data/hazo_auth.sqlite"
SYNC_DIR="$APP_DIR/data/blog-sync"

echo "=== Pulling latest blog data ==="

# Pull latest from git
cd "$APP_DIR"
git pull origin main

# Check sync data exists
if [ ! -d "$SYNC_DIR" ]; then
  echo "ERROR: No blog sync data found at $SYNC_DIR"
  echo "Run 'npm run blogs:push' on production first."
  exit 1
fi

# Check local DB exists
if [ ! -f "$DB_PATH" ]; then
  echo "ERROR: Local database not found at $DB_PATH"
  echo "Run 'npm run dev' first to initialize the database."
  exit 1
fi

# Import blog data — clear existing and re-insert
echo "Importing blog_categories..."
sqlite3 "$DB_PATH" <<SQL
DELETE FROM blog_posts;
DELETE FROM blog_categories;
SQL

if [ -f "$SYNC_DIR/blog_categories.sql" ]; then
  sqlite3 "$DB_PATH" < "$SYNC_DIR/blog_categories.sql"
  COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM blog_categories;")
  echo "  Imported $COUNT categories"
fi

echo "Importing blog_posts..."
if [ -f "$SYNC_DIR/blog_posts.sql" ]; then
  sqlite3 "$DB_PATH" < "$SYNC_DIR/blog_posts.sql"
  COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM blog_posts;")
  echo "  Imported $COUNT posts"
fi

# Copy blog images
if [ -d "$SYNC_DIR/blog-images" ]; then
  echo "Copying blog images..."
  mkdir -p "$APP_DIR/data/blog-images"
  cp -r "$SYNC_DIR/blog-images/"* "$APP_DIR/data/blog-images/" 2>/dev/null || true
  COUNT=$(ls -1 "$APP_DIR/data/blog-images/" 2>/dev/null | wc -l | tr -d ' ')
  echo "  Copied $COUNT images"
fi

echo "=== Blog data synced to local ==="
