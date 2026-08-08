#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" <<-EOSQL

  -- Extensions
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE EXTENSION IF NOT EXISTS btree_gin;
  CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA PUBLIC;
  -- CREATE EXTENSION IF NOT EXISTS timescaledb;
  -- CREATE EXTENSION IF NOT EXISTS paradedb;
  -- CREATE EXTENSION IF NOT EXISTS pgmq;
  -- ALTER EXTENSION timescaledb UPDATE;
	SELECT * FROM PG_EXTENSION;
  -- set custom config
	-- ALTER DATABASE postgres SET custom.secret_key=${SECRET_KEY}";
	-- set system config
	-- ALTER SYSTEM SET wal_level = logical;
	-- ALTER SYSTEM SET max_wal_senders = 5;
	-- ALTER SYSTEM SET max_replication_slots = 5;

  DO \$\$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_catalog.pg_roles
      WHERE rolname = '${TOOLBOX_DB_USER}'
    ) THEN
      CREATE ROLE ${TOOLBOX_DB_USER}
      LOGIN
      PASSWORD '${TOOLBOX_DB_PASSWORD}';
    END IF;
  END
  \$\$;

  -- Allow login to database
  GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO ${TOOLBOX_DB_USER};

  -- PostgreSQL 15+ built-in read-only role
  GRANT pg_read_all_data TO ${TOOLBOX_DB_USER};

  -- Ensure user cannot accidentally write
  REVOKE CREATE ON SCHEMA public FROM ${TOOLBOX_DB_USER};

  -- Verify
  SELECT rolname
  FROM pg_roles
  WHERE rolname = '${TOOLBOX_DB_USER}';

EOSQL
