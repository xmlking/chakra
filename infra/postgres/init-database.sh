#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_USER" <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE EXTENSION IF NOT EXISTS btree_gin;
  -- CREATE EXTENSION IF NOT EXISTS timescaledb;
  -- CREATE EXTENSION IF NOT EXISTS paradedb;
  -- CREATE EXTENSION IF NOT EXISTS pgmq;
  CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA PUBLIC;
  -- ALTER EXTENSION timescaledb UPDATE;
	SELECT * FROM PG_EXTENSION;
  -- set custom config
	-- ALTER DATABASE postgres SET custom.secret_key=${SECRET_KEY}";
	-- set system config
	-- ALTER SYSTEM SET wal_level = logical;
	-- ALTER SYSTEM SET max_wal_senders = 5;
	-- ALTER SYSTEM SET max_replication_slots = 5;
EOSQL
