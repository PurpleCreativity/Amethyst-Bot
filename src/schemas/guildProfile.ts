import mongoose, { mongo } from "mongoose";
import client from "../index.js";
import type { Group, User } from "wrapblox";
import { ButtonStyle, type ColorResolvable, type Guild, type GuildMember } from "discord.js";
import type { customPermissionOptions } from "../classes/SlashCommand.js";
import ButtonEmbed from "../classes/ButtonEmbed.js";
import Emojis from "../assets/Emojis.js";

type guildUser = {
    roblox: {
        username: string,
        id: number,
    }

    discord: {
        username: string,
        id: string,
    }

    points: number,

    note: {
        text: string,
        visible: boolean,

        updatedAt: Date,
    },

    ranklock: {
        rank: number,
        shadow: boolean,
        reason: string,

        updatedAt: Date,
    }
}

type Flag = {
    name: string,
    value: any,
}

type APIKey = {
    name : string,
    key : string,

    enabled : boolean,
    permissions : string[],

    createdAt : Date,
    createdBy : string,
}

type customPermission = {
    name: string,
    roles: string[],
    users: string[],
}

type customChannel = {
    id: string,
    name: string,
}

type Bind = {
    name: string,
    roles: string[],
    bind: string,
	enabled: boolean,
}

type trackedRobloxGroup = {
    groupId: number,
    channelId: string,
	tracked: {
        ranks: number[],
        types: string[],
    }
}

type linkedGuild  = {
    shortname: string,
    id: string,
    _documentId: string,

    settings: Map<string, Setting>,
}

type Setting = {
    name: string,
    description: string,
    devOnly: boolean,
    value: any,
}

type Module = {
    name: string,
    description: string,
    enabled: boolean,
}

type RobloxPlace = {
    name: string,
    id: string,
    key: string
}

type PointLog = {
	id : string,
    creator : {
        username : string,
        id: number,
    },

	data : {
		username : string,
        id: number,
        
		points : number,
	}[]
	notes : string | undefined,

    createdAt: Date,
};

type ScheduleEventType = {
    name : string,
    icon : string,
    color : string,

    description : string,

    useRobloxSchedule : boolean,
    useDiscordSchedule : boolean,

    canSchedule : { roles : string[], users : string[] },
}

type ScheduledEvent = {
	time : number;
	duration : number;
    placeId? : number,
	notes? : string;
	host: {
        username: string,
        id: number,
    },

    eventType: string;
    ongoing : boolean;

    discordEventId: string;
    robloxEventId: string;
	id : string;
}

interface guildProfileInterface extends mongoose.Document {
	_id: mongoose.Types.ObjectId,
    iv: string,

    guild: {
        id: string,
        shortname: string,

        channels: Map<string, customChannel>,
        customPermissions: Map<string, customPermission>,
    },

    modules: Map<string, Module>,
    binds: Map<string, Bind>,

    users: Map<string, guildUser>,
    pointlogs: Map<string, PointLog>,
    flags: Map<string, Flag>,

    schedule: {
        scheduled: Map<string, ScheduledEvent>,
        types: Map<string, ScheduleEventType>,
    }

    API: {
        keys: Map<string, APIKey>,

        enabled: boolean,
        banned: boolean,
    },

    roblox: {
        groupId: number,

        rover_Key: string,
        bloxlink_Key: string,

        trackedGroups: Map<string, trackedRobloxGroup>,
        places: Map<string, RobloxPlace>,
    },

    settings: Map<string, Setting>,

    linkedGuilds: Map<string, linkedGuild>

    //? Methods

    fetchGuild: () => Promise<Guild>,
    fetchOwner: () => Promise<GuildMember>,
    customPermissionCheck: (guildMember: GuildMember, customPermissions: customPermissionOptions[]) => Promise<boolean>,

    getUser: (searcher: string | number) => Promise<guildUser>,
    addUser: (robloxUser: User) => Promise<guildUser>,

    setNotes: (robloxId: number, noteData: { text: string, visible: boolean }, modifier?: number | User) => Promise<void>,
    setRanklock: (robloxId: number, ranklockData: { rank: number, shadow: boolean, reason: string }, modifier?: number | User) => Promise<void>,

    calculateUserPendingPoints: (robloxId: number) => Promise<number>,
    setPoints: (robloxId: number, points: number, modifier?: number | User) => Promise<void>,
    incrementPoints: (robloxId: number, points: number, modifier?: number | User) => Promise<void>,

    getModule: (name: string) => Promise<Module | undefined>,
    addModule: (module: Module) => Promise<void>,

    getChannel: (type: string) => Promise<customChannel>,
    setChannel: (data: customChannel) => Promise<void>,

    getAllPointLogs: () => Promise<PointLog[]>,
    addPointLog: (pointLog: PointLog, modifier?: number | User) => Promise<void>,
    getPointLog: (id: string) => Promise<PointLog | undefined>,
    deletePointLog: (id: string, modifier?: number | User) => Promise<void>,
    editPointLog: (id: string, newData: PointLog, modifier?: number | User) => Promise<void>,
    importPointLog: (id: string, modifier?: number | User) => Promise<void>,

    linkGroup: (groupID: number) => Promise<void>,
    fetchGroup: () => Promise<Group | undefined>,
}

const guildProfileSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    iv : String,

    guild : {
        id : String,
        shortname : String,

        channels : {
            type : Map,
            of : {
                id : String,
                name : String,
            }
        },
        customPermissions : {
            type : Map,
            of : {
                name : String,
                roles : [String],
                users : [String],
            }
        },
    },

    modules : {
        type : Map,
        of : {
            name : String,
            description : String,
            enabled : Boolean,
        }
    },

    binds: {
        type : Map,
        of : {
            name: String,
            roles: [String],
            bind: String,
            enabled: Boolean,
        }
    },

    users : {
        type : Map,
        of : {
            roblox : {
                username : String,
                id : Number,
            },

            discord: {
                username: String,
                id: String,
            },

            points : Number,

            note : {
                text : String,
                visible : Boolean,

                updatedAt : Date,
            },

            ranklock : {
                rank : Number,
                shadow : Boolean,
                reason : String,

                updatedAt : Date,
            }
        }
    },

    flags : {
        type : Map,
        of : {
            name : String,
            value: mongoose.Schema.Types.Mixed,
        }
    },

    pointlogs : {
        type : Map,
        of : {
            id : String,
            creator : {
                username : String,
                id: Number,
            },

            data : [{
                username : String,
                id: Number,
                points : Number,
            }],
            notes : String,

            createdAt : Date,
        }
    },

    schedule : {
        scheduled : {
            type : Map,
            of : {
                time : Number,
                duration : Number,
                notes : String,
                placeId : Number,
                host: {
                    username: String,
                    id: Number,
                },

                eventType : String,
                ongoing : Boolean,

                discordEventId: String,
                robloxEventId: String,
                id : String,
            }
        },
        types : {
            type : Map,
            of : {
                name : String,
                icon : String,
                color : String,

                description : String,

                useRobloxSchedule : Boolean,
                useDiscordSchedule : Boolean,

                canSchedule : {
                    roles : [String],
                    users : [String],
                }
            }
        },
    },

    API : {
        keys : {
            type : Map,
            of : {
                name : String,
                key : String,

                enabled : Boolean,
                permissions : [String],

                createdAt : Date,
                createdBy : String,
            }
        },

        enabled : Boolean,
        banned : Boolean,
    },

    roblox : {
        groupId : Number,

        rover_Key : String,
        bloxlink_Key : String,

        trackedGroups: {
            type : Map,
            of : {
                groupId: Number,
                channelId: String,
                tracked: {
                    ranks: [Number],
                    types: [String],
                }
            }
        },

        places : {
            type : Map,
            of : {
                name : String,
                id : String,
                key : String,
            }
        },
    },

    settings : {
        type : Map,
        of : {
            name : String,
            description : String,
            devOnly : Boolean,
            value : mongoose.Schema.Types.Mixed,
        }
    },

    linkedGuilds : {
        type : Map,
        of : {
            shortname : String,
            id : String,
            _documentId : mongoose.Types.ObjectId,

            settings : {
                type : Map,
                of : {
                    name : String,
                    description : String,
                    value : mongoose.Schema.Types.Mixed,
                }
            }
        }
    }
});

//? Methods

guildProfileSchema.methods.fetchGuild = async function () {
    return await client.Functions.GetGuild(this.guild.id);
}

guildProfileSchema.methods.fetchOwner = async function () {
    const guild = await this.fetchGuild();
    const owner = await guild.fetchOwner().then((owner:any) => owner.user);

    return owner;
}

guildProfileSchema.methods.customPermissionCheck = async function (guildMember: GuildMember, customPermissions: customPermissionOptions[]) {
    if (customPermissions.length === 0) return true;

    const owner = await this.fetchOwner();
    if (guildMember.id === owner.id) return true;
    if (guildMember.permissions.has("Administrator")) return true;

    const roles = guildMember.roles.cache.map((role) => role.id);
    const ownedPermissions = [] as customPermissionOptions[];

    const adminPermission = this.guild.customPermissions.get("Administrator")
    if (adminPermission) {
        if (adminPermission.users.includes(guildMember.id)) return true;

        for (const roleId of roles) {
            if (adminPermission.roles.includes(roleId)) return true;
        }
    }

    for (const permissionName of customPermissions) {
        const permission = this.guild.customPermissions.get(permissionName)
		if (!permission) continue;

        if (permission.users.includes(guildMember.id)) {ownedPermissions.push(permission.name); continue;};

		for (const roleId of roles) {
			if (permission.roles.includes(roleId)) {ownedPermissions.push(permission.name); continue;};
		}
    }

    if (customPermissions.every(permission => ownedPermissions.includes(permission))) return true;

    return false;
}

// Users
guildProfileSchema.methods.getUser = async function (searcher: string | number) {
    const id = Number.parseInt(searcher as string);
    if (!id) {
        for (const user of this.users.values()) {
            if (user.robloxUsername.toLowerCase() === (searcher as string).toLowerCase()) {
                return user;
            }
        }
        return this.addUser(await client.WrapBlox.fetchUserByName(searcher as string));
    }

    if (this.users.has(id.toString())) {
        return this.users.get(id.toString());
    }

    return this.addUser(await client.WrapBlox.fetchUser(id));
}

guildProfileSchema.methods.addUser = async function (robloxUser: User) {
    this.users.set(robloxUser.id.toString(), {
        roblox: {
            username: robloxUser.name,
            id: robloxUser.id,
        },

        points: 0,

        note: {
            text: "",
            visible: false,

            updatedAt: new Date(),
        },

        ranklock: {
            rank: 0,
            shadow: false,
            reason: "",

            updatedAt: new Date(),
        }
    });

    await this.save();

    return this.getUser(robloxUser.id);
}

// Points
guildProfileSchema.methods.calculateUserPendingPoints = async function (robloxId: number) {
    const robloxUser = await client.Functions.GetRobloxUser(robloxId);
    if (!robloxUser) return 0;

    const pointlogs = await this.getAllPointLogs();
    let pendingPoints = 0;

    for (const log of pointlogs) {
        const entry = log.data.find((entry: { username: string, points: number }) => entry.username.toLowerCase() === robloxUser.name.toLowerCase());
        if (!entry) continue;

        pendingPoints += entry.points;
    }

    return pendingPoints;
}

guildProfileSchema.methods.setNotes = async function (robloxId: number, noteData: { text: string, visible: boolean }, modifier?: number | User) {
    const user = await this.getUser(robloxId);
    if (!user) throw new Error("User not found");

    const oldData = user.note;
    user.note = noteData;
    user.note.updatedAt = new Date();
    await this.save();

    if (!modifier) return;

    const channel = await this.getChannel("PointsDatabaseUpdates");
    if (!channel) return;

    let actualModifier: User | undefined;
    if (typeof modifier === "number") actualModifier = await this.client.Functions.GetRobloxUser(modifier); else actualModifier = modifier;
    if (!actualModifier) return;

    const targetUser = await client.Functions.GetRobloxUser(robloxId);
    if (!targetUser) return;

    channel.send({ embeds: [
        client.Functions.makeInfoEmbed({
            title: "Notes Updated",
            description: `[${actualModifier.name}](https://www.roblox.com/users/${actualModifier.id}/profile) **updated** the notes for [${targetUser.name}](https://www.roblox.com/users/${targetUser.id}/profile)`,
            thumbnail: await targetUser.fetchUserHeadshotUrl(),
            footer: { text: actualModifier.name, iconURL: await actualModifier.fetchUserHeadshotUrl() },
            fields: [
                { name: "Old Data", value: `${oldData.text !== "" ? `Visible: \`${oldData.visible}\`\n Note: ${oldData.text}` : "No notes"}`, inline: false },
                { name: "New Data", value: `${noteData.text !== "" ? `Visible: \`${noteData.visible}\`\n Note: ${noteData.text}` : "No notes"}`, inline: false }
            ]
        })
    ] })
}

guildProfileSchema.methods.setRanklock = async function (robloxId: number, ranklockData: { rank: number, shadow: boolean, reason: string }, modifier?: number | User) {
    const user = await this.getUser(robloxId);
    if (!user) throw new Error("User not found");

    const oldData = user.ranklock;

    user.ranklock = ranklockData;
    user.ranklock.updatedAt = new Date();
    await this.save();

    if (!modifier) return;

    const channel = await this.getChannel("PointsDatabaseUpdates");
    if (!channel) return;

    let actualModifier: User | undefined;
    if (typeof modifier === "number") actualModifier = await this.client.Functions.GetRobloxUser(modifier); else actualModifier = modifier;
    if (!actualModifier) return;

    const targetUser = await client.Functions.GetRobloxUser(robloxId);
    if (!targetUser) return;

    channel.send({ embeds: [
        client.Functions.makeInfoEmbed({
            title: "Ranklock Updated",
            description: `[${actualModifier.name}](https://www.roblox.com/users/${actualModifier.id}/profile) **updated** the ranklock for [${targetUser.name}](https://www.roblox.com/users/${targetUser.id}/profile)`,
            thumbnail: await targetUser.fetchUserHeadshotUrl(),
            footer: { text: actualModifier.name, iconURL: await actualModifier.fetchUserHeadshotUrl() },
            fields: [
                { name: "Old Data", value: `${oldData.rank !== 0 ? `Rank: \`${oldData.rank}\`\n Shadow: \`${oldData.shadow}\`\n Reason: ${oldData.reason}` : "No ranklock"}`, inline: false },
                { name: "New Data", value: `${ranklockData.rank !== 0 ? `Rank: \`${ranklockData.rank}\`\n Shadow: \`${ranklockData.shadow}\`\n Reason: ${ranklockData.reason}` : "No ranklock"}`, inline: false }
            ]
        })
    ]})
}

guildProfileSchema.methods.setPoints = async function (robloxId: number, newAmount: number, modifier?: number | User) {
    const user = await this.getUser(robloxId);
    if (!user) throw new Error("User not found");

    const oldPoints = user.points;

    user.points = newAmount;
    await this.save();

    if (!modifier) return;

    const channel = await this.getChannel("PointsDatabaseUpdates");
    if (!channel) return;

    let actualModifier: User | undefined;
    if (typeof modifier === "number") actualModifier = await this.client.Functions.GetRobloxUser(modifier); else actualModifier = modifier;
    if (!actualModifier) return;

    const targetUser = await client.Functions.GetRobloxUser(robloxId);
    if (!targetUser) return;

    channel.send({ embeds: [
        client.Functions.makeInfoEmbed({
            title: "Points Updated",
            description: `[${actualModifier.name}](https://www.roblox.com/users/${actualModifier.id}/profile) **set** [${targetUser.name}](https://www.roblox.com/users/${targetUser.id}/profile)'s points to \`${newAmount}\``,
            thumbnail: await targetUser.fetchUserHeadshotUrl(),
            footer: { text: actualModifier.name, iconURL: await actualModifier.fetchUserHeadshotUrl() },
            fields: [
                { name: "Old Points", value: `${oldPoints}`, inline: true },
                { name: "New Points", value: `${newAmount}`, inline: true }
            ]
        })
    ] })        
}

guildProfileSchema.methods.incrementPoints = async function (robloxId: number, amount: number, modifier?: number | User) {
    const user = await this.getUser(robloxId);
    if (!user) throw new Error("User not found");
    const oldPoints = user.points;

    user.points += amount;
    await this.save();

    if (!modifier) return;

    const channel = await this.getChannel("PointsDatabaseUpdates");
    if (!channel) return;

    let actualModifier: User | undefined;
    if (typeof modifier === "number") actualModifier = await this.client.Functions.GetRobloxUser(modifier); else actualModifier = modifier;
    if (!actualModifier) return;

    const targetUser = await client.Functions.GetRobloxUser(robloxId);
    if (!targetUser) return;

    channel.send({ embeds: [
        client.Functions.makeInfoEmbed({
            title: "Points Incremented",
            description: `[${actualModifier.name}](https://www.roblox.com/users/${actualModifier.id}/profile) **added** \`${amount}\` points to [${targetUser.name}](https://www.roblox.com/users/${targetUser.id}/profile)`,
            thumbnail: await targetUser.fetchUserHeadshotUrl(),
            footer: { text: actualModifier.name, iconURL: await actualModifier.fetchUserHeadshotUrl() },
            fields: [
                { name: "Old Points", value: `\`${oldPoints}\``, inline: true },
                { name: "New Points", value: `\`${oldPoints + amount}\``, inline: true },
            ]
        })
    ] });
}
// Channels
guildProfileSchema.methods.getChannel = async function (type: string) {
    const channel = this.guild.channels.get(type);
    if (!channel) return undefined;

    if (channel.id === "0") return undefined;

    const actualChannel = await client.Functions.GetChannel(channel.id, this.guild.id);
    return actualChannel;
}

guildProfileSchema.methods.setChannel = async function (data: customChannel) {
    this.guild.channels.set(data.name, data);
    await this.save();
}

// Modules
guildProfileSchema.methods.getModule = async function (name: string) {
    return this.modules.get(name);
}

guildProfileSchema.methods.addModule = async function (module: Module) {
    this.modules.set(module.name, module);
    await this.save();
}

// Pointlogs
guildProfileSchema.methods.getAllPointLogs = async function () {
    const pointlogs = [] as PointLog[];

    for (const pointlog of this.pointlogs.values()) {
        pointlogs.push(pointlog);
    }

    pointlogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return pointlogs;
}

guildProfileSchema.methods.addPointLog = async function (pointLog: PointLog, modifier?: number | User) {
    this.pointlogs.set(pointLog.id, pointLog);
    await this.save();

    if (!modifier) return;

    const channel = await this.getChannel("PointLogUpdates");
    if (!channel) return;

    let actualModifier: User | undefined;
    if (typeof modifier === "number") actualModifier = await this.client.Functions.GetRobloxUser(modifier); else actualModifier = modifier;
    if (!actualModifier) return;

    const baseEmbed = client.Functions.makePointlogEmbed(pointLog);
    const buttonEmbed = new ButtonEmbed(baseEmbed);

    buttonEmbed.addButton({
        label: "View Data",
        style: ButtonStyle.Secondary,
        emoji: Emojis.folder_open,
        customId: `STATIC_POINTLOG_${pointLog.id}_VIEWDATA`,
    })

    buttonEmbed.nextRow();

    buttonEmbed.addButton({
        label: "Import",
        style: ButtonStyle.Success,
        emoji: Emojis.import,
        customId: `STATIC_POINTLOG_${pointLog.id}_IMPORT`,
    })

    buttonEmbed.addButton({
        label: "Delete",
        style: ButtonStyle.Danger,
        emoji: Emojis.delete,
        customId: `STATIC_POINTLOG_${pointLog.id}_DELETE`,
    })

    channel.send(buttonEmbed.getMessageData());
}

guildProfileSchema.methods.getPointLog = async function (id: string) {
    return this.pointlogs.get(id);
}

guildProfileSchema.methods.importPointLog = async function (id: string) {
    const pointLog = await this.getPointLog(id);
    if (!pointLog) throw new Error("Point log not found");

    for (const data of pointLog.data) {
        const user = await this.getUser(data.id);
        user.points += data.points;
    }


    this.pointlogs.delete(id);
    await this.save();
}

guildProfileSchema.methods.editPointLog = async function (id: string, newData: PointLog) {
    const pointLog = await this.getPointLog(id);
    if (!pointLog) throw new Error("Point log not found");

    this.pointlogs.delete(id);
    this.pointlogs.set(pointLog.id, pointLog);
    await this.save();
}

guildProfileSchema.methods.deletePointLog = async function (id: string) {
    const pointLog = await this.getPointLog(id);
    if (!pointLog) throw new Error("Point log not found");

    await this.pointlogs.delete(id);
    await this.save();
}

// Schedule
guildProfileSchema.methods.makeScheduleEmbed = async function (eventData: ScheduledEvent) {
    const eventType = this.schedule.types.get(eventData.eventType);
    if (!eventType) throw new Error("Event type not found");

    const embed = client.Functions.makeInfoEmbed({
        title: `\`${eventData.id}\``,
        footer: { text: eventData.id },
        color: eventType.color as ColorResolvable,
    })

    embed.addField("Type", `\`${eventType.name}\``, true)
    embed.addField("Time", `<t:${Math.round(new Date(eventData.time).getTime() / 1000)}:F>`, true)
    embed.addField("Duration", `${eventData.duration} minutes`, true)
    embed.addField("Host", `[${eventData.host.username}](https://www.roblox.com/users/${eventData.host.id}/profile)`, true)

    if (eventData.placeId !== 0) {
        const place = await client.WrapBlox.fetchGame(await client.Functions.ConvertPlaceIDToUniverseID(eventData.placeId as number))
        if (!place) throw new Error(`Couldn't find place with id ${eventData.placeId}`);

        embed.addField("Game", `[${place.name}](https://www.roblox.com/games/${place.id})`, true)
    }

    embed.addField("Notes", `${eventData.notes || "\`No notes\`"}`, false)

    return embed;
}

// Roblox
guildProfileSchema.methods.linkGroup = async function (groupID:number) {
    this.roblox.group = groupID;
    await this.save();
}

guildProfileSchema.methods.fetchGroup = async function () {
    try {
        return await client.WrapBlox.fetchGroup(this.roblox.groupId);
    } catch (error) {
        return undefined;
    }
}

const guildProfile = mongoose.model("guildProfile", guildProfileSchema);

export default guildProfile;
export type { guildProfileInterface, guildUser, APIKey, PointLog, ScheduleEventType, ScheduledEvent, RobloxPlace, customChannel, customPermission, linkedGuild, Setting, Module };