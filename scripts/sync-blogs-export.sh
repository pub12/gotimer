#!/bin/bash
# Run on PRODUCTION to export blog data and push to git
# Usage: npm run blogs:push (or bash scripts/sync-blogs-export.sh)

set -e

APP_DIR="/home/pubs/gotimer"
DB_PATH="$APP_DIR/data/hazo_auth.sqlite"
EXPORT_DIR="$APP_DIR/data/blog-sync"

echo "=== Exporting blog data from production ==="

# Check DB exists
if [ ! -f "$DB_PATH" ]; then
  echo "ERROR: Database not found at $DB_PATH"
  exit 1
fi

# Create export directory
mkdir -p "$EXPORT_DIR"

# Dump blog tables as SQL INSERT statements
echo "Dumping blog_posts..."
sqlite3 "$DB_PATH" <<'SQL' > "$EXPORT_DIR/blog_posts.sql"
.mode insert blog_posts
SELECT * FROM blog_posts;
SQL

echo "Dumping blog_categories..."
sqlite3 "$DB_PATH" <<'SQL' > "$EXPORT_DIR/blog_categories.sql"
.mode insert blog_categories
SELECT * FROM blog_categories;
SQL

# Copy blog images if they exist
if [ -d "$APP_DIR/data/blog-images" ]; then
  echo "Copying blog images..."
  mkdir -p "$EXPORT_DIR/blog-images"
  cp -r "$APP_DIR/data/blog-images/"* "$EXPORT_DIR/blog-images/" 2>/dev/null || true
fi

echo "Exported to $EXPORT_DIR"

# Git commit and push
cd "$APP_DIR"
git add -f data/blog-sync/
git commit -m "sync: blog data $(date +%Y-%m-%d_%H:%M)" || echo "No changes to commit"
git push origin main

echo "=== Blog data pushed to git ==="
