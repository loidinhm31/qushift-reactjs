DROP TABLE IF EXISTS users CASCADE;

CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    user_id    UUID PRIMARY KEY                  DEFAULT uuid_generate_v4(),
    username   VARCHAR(32)              NOT NULL CHECK ( username <> '' ),
    password   VARCHAR(250)             NOT NULL CHECK ( octet_length(password) <> 0 ),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE          DEFAULT CURRENT_TIMESTAMP
);
