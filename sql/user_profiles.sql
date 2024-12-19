CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT UNSIGNED PRIMARY KEY,
    _v BIGINT UNSIGNED NOT NULL DEFAULT 0,

    roblox_id BIGINT UNSIGNED UNIQUE,

    settings JSON NOT NULL DEFAULT '{}'
);

CREATE TRIGGER IF NOT EXISTS trigger_UserProfiles_BeforeUpdate
BEFORE UPDATE ON user_profiles
FOR EACH ROW
BEGIN
    SET NEW._v = OLD._v + 1;
END;
