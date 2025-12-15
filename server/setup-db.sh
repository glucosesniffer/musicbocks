#!/bin/bash
# Database setup script for Musicbocks
# This script grants permissions and creates the schema

echo "Setting up Musicbocks database..."

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw musicbocks; then
    echo "Creating database 'musicbocks'..."
    createdb musicbocks
fi

echo "Granting permissions to user 'ahmad'..."
# Connect as postgres superuser to grant permissions
psql -d musicbocks -c "GRANT ALL PRIVILEGES ON DATABASE musicbocks TO ahmad;" 2>/dev/null || echo "Note: Run this as postgres user if permission denied"
psql -d musicbocks -c "GRANT ALL ON SCHEMA public TO ahmad;" 2>/dev/null || echo "Note: Run this as postgres user if permission denied"
psql -d musicbocks -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ahmad;" 2>/dev/null || echo "Note: Run this as postgres user if permission denied"

echo "Creating tables..."
psql -d musicbocks -f schema.sql

echo "Done! Database setup complete."

