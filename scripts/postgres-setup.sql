create user cuppa with password 'toor';
create database "cuppa-authentication" with owner cuppa;
create database "cuppa-finance-stats" with owner cuppa;
create database "cuppa-finance-stats-test" with owner cuppa;

-- use cuppa-finance-stats & cuppa-finance-stats-test
ALTER SCHEMA public OWNER TO cuppa;

--
-- psql -U owner -d database_name
-- GRANT CONNECT ON DATABASE database_name TO user_name
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO user_name
-- ALTER DATABASE "database_name" OWNER TO user_name;
-- ALTER SCHEMA public OWNER TO user_name;