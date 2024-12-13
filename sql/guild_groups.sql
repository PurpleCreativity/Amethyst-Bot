CREATE TABLE IF NOT EXISTS guild_groups (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    _v BIGINT UNSIGNED NOT NULL DEFAULT 0,

    `name` VARCHAR(255) UNIQUE NOT NULL
);

CREATE TRIGGER IF NOT EXISTS trigger_GuildGroups_BeforeUpdate
BEFORE UPDATE ON guild_groups
FOR EACH ROW
BEGIN
    SET NEW._v = OLD._v + 1;
END;

CREATE TABLE IF NOT EXISTS guild_group_memberships (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    _v BIGINT UNSIGNED NOT NULL DEFAULT 0,

    group_id BIGINT UNSIGNED NOT NULL,
    guild_id BIGINT UNSIGNED NOT NULL,

    settings JSON NOT NULL DEFAULT '{}',

    FOREIGN KEY (group_id) REFERENCES guild_groups(id),
    FOREIGN KEY (guild_id) REFERENCES guild_profiles(id),

    UNIQUE(group_id, guild_id)
);

CREATE TRIGGER IF NOT EXISTS trigger_GuildGroupMemberships_BeforeUpdate
BEFORE UPDATE ON guild_group_memberships
FOR EACH ROW
BEGIN
    SET NEW._v = OLD._v + 1;
END;
