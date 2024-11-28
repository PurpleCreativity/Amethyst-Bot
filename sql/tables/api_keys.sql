CREATE TABLE IF NOT EXISTS api_keys (
    _id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    guild_profile_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(20) NOT NULL,
    value VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    permissions JSON NOT NULL DEFAULT '{}',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (guild_profile_id) REFERENCES guild_profiles(_id),
    FOREIGN KEY (created_by) REFERENCES user_profiles(_id)
);