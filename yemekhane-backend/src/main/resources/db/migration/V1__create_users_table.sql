

CREATE TABLE users (
    id                          BIGINT                  AUTO_INCREMENT PRIMARY KEY,
    full_name                   VARCHAR(100)            NOT NULL,
    username                    VARCHAR(50)             NOT NULL UNIQUE,
    password_hash               VARCHAR(255)            NOT NULL,
    role                        ENUM('ADMIN', 'USER')   NOT NULL DEFAULT 'USER',
    active                      BOOLEAN                 NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMP               NOT NULL,
    updated_at                  TIMESTAMP               NOT NULL
);