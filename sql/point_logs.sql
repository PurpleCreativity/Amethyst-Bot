CREATE TABLE IF NOT EXISTS point_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `version` BIGINT UNSIGNED NOT NULL DEFAULT 0,

    guild_id BIGINT UNSIGNED NOT NULL,

    log_id VARCHAR(32) NOT NULL,
    `log_data` JSON NOT NULL,
    log_note VARCHAR(500),

    creator_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (guild_id) REFERENCES guild_profiles(id),
    FOREIGN KEY (creator_id) REFERENCES user_profiles(roblox_id)
);

CREATE TRIGGER IF NOT EXISTS trigger_PointLogs_BeforeUpdate
BEFORE UPDATE ON point_logs
FOR EACH ROW
BEGIN
    SET NEW.version = OLD.version + 1;
END;
