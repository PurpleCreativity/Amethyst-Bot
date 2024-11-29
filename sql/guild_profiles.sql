CREATE TABLE IF NOT EXISTS guild_profiles (
    _id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    _iv VARBINARY(16) NOT NULL,
    
    shortname VARCHAR(10) NOT NULL UNIQUE,

    guild_id VARCHAR(20) NOT NULL,
    guild_name VARCHAR(100) NOT NULL,

    permissions JSON NOT NULL DEFAULT '[]',
    channels JSON NOT NULL DEFAULT '{}',

    settings JSON NOT NULL DEFAULT '{}',
    fflags JSON NOT NULL DEFAULT '{}',

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);