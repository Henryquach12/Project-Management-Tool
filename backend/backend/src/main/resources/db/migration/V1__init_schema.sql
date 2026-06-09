-- Baseline migration: creates all tables for fresh deployments.
-- On existing databases this runs safely via CREATE TABLE IF NOT EXISTS.
-- Flyway is configured with baseline-version=1, so this is not re-executed
-- on databases that were created before Flyway was introduced.

CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(255) UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    google_id     VARCHAR(255),
    display_name  VARCHAR(255),
    provider      VARCHAR(50)  NOT NULL,
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id    BIGINT NOT NULL REFERENCES users(id),
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_members (
    id            BIGSERIAL PRIMARY KEY,
    project_id    BIGINT NOT NULL REFERENCES projects(id),
    user_id       BIGINT NOT NULL REFERENCES users(id),
    role          VARCHAR(50) NOT NULL,
    reports_to_id BIGINT REFERENCES users(id),
    UNIQUE (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id                   BIGSERIAL PRIMARY KEY,
    title                VARCHAR(255) NOT NULL,
    description          TEXT,
    status               VARCHAR(50)  NOT NULL DEFAULT 'TODO',
    due_date             DATE,
    project_id           BIGINT NOT NULL REFERENCES projects(id),
    created_by           BIGINT NOT NULL REFERENCES users(id),
    reminder_2_days_sent BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_1_day_sent  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMP,
    updated_at           TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_assignments (
    task_id BIGINT NOT NULL REFERENCES tasks(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    PRIMARY KEY (task_id, user_id)
);
