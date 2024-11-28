CREATE TABLE IF NOT EXISTS user_profiles (
    _id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    _version BIGINT UNSIGNED NOT NULL DEFAULT 1,

    iv VARBINARY(16) NOT NULL,

    discord_id VARCHAR(20) NOT NULL UNIQUE,
    discord_username VARCHAR(32) NOT NULL UNIQUE,

    roblox_id BIGINT UNSIGNED UNIQUE,
    roblox_username VARCHAR(20) UNIQUE,

    settings JSON NOT NULL DEFAULT '{}',
    fflags JSON NOT NULL DEFAULT '{}',

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Triggers

CREATE TRIGGER IF NOT EXISTS user_profiles__before
BEFORE UPDATE ON user_profiles
FOR EACH ROW
BEGIN
    SET NEW._version = OLD._version + 1;
END;