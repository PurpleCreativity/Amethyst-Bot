import client from "../../main.js";

export type rawUserData = {
    _id: number;
    _iv: Buffer;

    discord_id: string;
    discord_username: string;

    roblox_id: number | null;
    roblox_username: string | null;

    settings: Record<string, unknown>;
    fflags: Record<string, unknown>;

    updated_at: Date;
};

export default class UserProfile {
    readonly rawdata: rawUserData;

    readonly _id: number;
    readonly _iv: string;

    readonly discord_id: string;
    readonly discord_username: string;

    readonly roblox_id: number | null;
    readonly roblox_username: string | null;

    readonly settings: Record<string, unknown>;
    readonly fflags: Record<string, unknown>;

    readonly updated_at: Date;

    constructor(rawdata: rawUserData) {
        this.rawdata = rawdata;

        this._id = rawdata._id;
        this._iv = rawdata._iv.toString("hex");

        this.discord_id = rawdata.discord_id;
        this.discord_username = rawdata.discord_username;

        this.roblox_id = rawdata.roblox_id;
        this.roblox_username = rawdata.roblox_username;

        this.settings = rawdata.settings;
        this.fflags = rawdata.fflags;

        this.updated_at = rawdata.updated_at;
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
                    discord_username = ?,
                    roblox_id = ?,
                    roblox_username = ?,
                    settings = ?,
                    fflags = ?
                 WHERE _id = ?
                `,
                [
                    this.discord_username,
                    this.roblox_id,
                    this.roblox_username,
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
