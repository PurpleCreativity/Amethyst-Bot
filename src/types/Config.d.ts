type Config = {
    version: string;

    baseURL: string;

    credentials: {
        discordToken: string;
        robloxCookie: string;
        databaseURL: string;
    
        encryptionKey: string;
    },
    
    logConfig: {
		[key: string]: {
			color: ChalkInstance
			name: string;
		};
	}
};

export type { Config };