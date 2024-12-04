import client from "../../main.js";

export type rawUserData = {
    _id: number;
    __v: number;

    discord_id: number;
    roblox_id: number | null;

    settings: Record<string, unknown>;
    fflags: Record<string, unknown>;
};

export default class UserProfile {
    readonly rawdata: rawUserData;

    readonly _id: number;
    readonly __v: number;
    
    readonly discordId: string;
    readonly robloxId: number | null;

    readonly settings: Record<string, unknown>;
    readonly fflags: Record<string, unknown>;

    constructor(rawdata: rawUserData) {
        this.rawdata = rawdata;

        this._id = rawdata._id;
        this.__v = rawdata.__v;
        
        this.discordId = rawdata.discord_id.toString();
        this.robloxId = rawdata.roblox_id;

        this.settings = rawdata.settings;
        this.fflags = rawdata.fflags;
    }

    getSetting = (key: string): unknown => {
        return this.settings[key];
    };

    setSetting = (key: string, value: unknown): void => {
        this.settings[key] = value;
    };

    getFFlag = (key: string): unknown => {
        return this.fflags[key];
    };

    setFFlag = (key: string, value: unknown): void => {
        this.fflags[key] = value;
    };

    save = async (): Promise<void> => {
        const connection = await client.Database.getConnection();

        try {
            await connection.beginTransaction();

            const result = await connection.query(
                `UPDATE user_profiles SET
                    roblox_id = ?,
                    settings = ?,
                    fflags = ?
                 WHERE _id = ?
                `,
                [
                    this.robloxId,
                    this.settings,
                    this.fflags,

                    this._id,
                ],
            );

            if (result.affectedRows < 0) throw new Error("Failed to save changes.");

            await connection.commit();
        } catch (error) {
            await connection.rollback();

            throw error;
        } finally {
            await connection.end();
        }
    };
}
