CREATE TABLE IF NOT EXISTS audit_logs (
    id           BIGSERIAL PRIMARY KEY,
    entity_type  VARCHAR(100) NOT NULL,
    entity_id    BIGINT,
    action       VARCHAR(50)  NOT NULL,
    performed_by BIGINT REFERENCES users(id),
    diff         TEXT,
    created_at   TIMESTAMP,
    updated_at   TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
