import { SlashCommandSubcommandBuilder } from "discord.js";
import SlashCommand from "../../classes/SlashCommand.js";
import client from "../../index.js";
import type { Role } from "wrapblox";

export default new SlashCommand({
    name: "ranklock",
    description: "Locks a user's rank",

    defer: true,
    customPermissions: ["PointsManager"],
    module: "Points",
    subcommands: [
        new SlashCommandSubcommandBuilder()
            .setName("set")
            .setDescription("Locks a user's rank")
            .addStringOption(option =>
                option
                    .setName("user")
                    .setDescription("The username or id of the user")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("rank")
                    .setDescription("The rank name or id")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("reason")
                    .setDescription("The reason for the ranklock")
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName("shadow")
                    .setDescription("Whether the ranklock should be shadow")
                    .setRequired(false)
            )
        ,

        new SlashCommandSubcommandBuilder()
            .setName("remove")
            .setDescription("Unlocks a user's rank")
            .addStringOption(option =>
                option
                    .setName("user")
                    .setDescription("The username or id of the user")
                    .setRequired(true)
            )
    ],

    execute: async (interaction, guildDataProfile) => {
        if (!interaction.guild || !guildDataProfile) return;

        const modifierUser = await client.Functions.GetLinkedRobloxUser(interaction.user.id);
        if (!modifierUser) return interaction.editReply({ embeds: [client.Functions.makeErrorEmbed({ title: "Add Points", description: "You are not linked to a Roblox account" })] });

        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case "set": {
                const user = interaction.options.getString("user", true);
                const rank = interaction.options.getString("rank", true);
                const reason = interaction.options.getString("reason", false);
                const shadow = interaction.options.getBoolean("shadow", false) ?? false;

                const robloxGroup = await guildDataProfile.fetchGroup();
                if (!robloxGroup) return interaction.editReply({ embeds: [client.Functions.makeErrorEmbed({ title: "Manage Ranklock", description: "Group not found" })] });

                let actualRole: Role | undefined;
                actualRole = await robloxGroup.fetchRoleByName(rank);
                if (!actualRole && !Number.isNaN(Number(rank))) actualRole = await robloxGroup.fetchRoleByRank(Number.parseFloat(rank));
                if (!actualRole) return interaction.editReply({ embeds: [client.Functions.makeErrorEmbed({ title: "Manage Ranklock", description: "Role not found" })] });

                const robloxUser = await client.Functions.GetRobloxUser(user);
                if (!robloxUser) return interaction.editReply({ embeds: [client.Functions.makeErrorEmbed({ title: "Manage Ranklock", description: "User not found" })] });

                await guildDataProfile.setRanklock(robloxUser.id, { rank: actualRole.rank, shadow, reason: reason || "No reason provided" }, modifierUser);

                return interaction.editReply({ embeds: [client.Functions.makeSuccessEmbed({ title: "Manage Ranklock", description: `Locked ${robloxUser.name}'s rank to \`${actualRole.name}\`:\`${actualRole.rank}\``, footer: { text: robloxUser.name, iconURL: await robloxUser.fetchUserHeadshotUrl() } })] });
            }

            case "remove": {
                const user = interaction.options.getString("user", true);

                const robloxUser = await client.Functions.GetRobloxUser(user);
                if (!robloxUser) return interaction.editReply({ embeds: [client.Functions.makeErrorEmbed({ title: "Manage Ranklock", description: "User not found" })] });

                await guildDataProfile.setRanklock(robloxUser.id, { rank: 0, shadow: false, reason: "" }, modifierUser);

                return interaction.editReply({ embeds: [client.Functions.makeSuccessEmbed({ title: "Manage Ranklock", description: `Unlocked ${robloxUser.name}'s rank`, footer: { text: robloxUser.name, iconURL: await robloxUser.fetchUserHeadshotUrl() } })] });
            }
        }
    }
})