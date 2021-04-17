CREATE USER cuppa WITH PASSWORD 'toor';
create database "cuppa-finance-stats" with owner cuppa;
create database "cuppa-finance-stats-test" with owner cuppa;
create database "cuppa-authentication" with owner cuppa;

GRANT CONNECT ON DATABASE "cuppa-finance-stats" TO cuppa;
GRANT CONNECT ON DATABASE "cuppa-finance-stats-test" TO cuppa;
ALTER DATABASE "cuppa-finance-stats" OWNER TO cuppa;
ALTER DATABASE "cuppa-finance-stats-test" OWNER TO cuppa;
ALTER DATABASE "cuppa-authentication" OWNER TO cuppa;

-- with root per each database
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cuppa;
ALTER SCHEMA public OWNER TO cuppa;
