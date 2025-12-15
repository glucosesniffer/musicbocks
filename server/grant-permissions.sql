-- Grant permissions script
-- Run this as the postgres superuser first, then run schema.sql as your regular user
-- Usage: psql -U postgres -d musicbocks -f grant-permissions.sql

-- Grant all privileges on the database to user 'ahmad'
GRANT ALL PRIVILEGES ON DATABASE musicbocks TO ahmad;

-- Connect to the musicbocks database
\c musicbocks

-- Grant all privileges on the public schema
GRANT ALL ON SCHEMA public TO ahmad;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ahmad;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ahmad;

-- If tables already exist, grant privileges on them
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ahmad;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ahmad;

