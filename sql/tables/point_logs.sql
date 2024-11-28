CREATE TABLE IF NOT EXISTS point_logs (
    _id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    _version BIGINT UNSIGNED NOT NULL DEFAULT 1,

    guild_profile_id BIGINT UNSIGNED NOT NULL,

    id VARCHAR(32) NOT NULL,
    `data` JSON NOT NULL,
    note_content VARCHAR(500),

    creator_name VARCHAR(20) NOT NULL,
    creator_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (guild_profile_id) REFERENCES guild_profiles(_id)
);