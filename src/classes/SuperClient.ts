import { Client, ClientOptions, TextChannel } from "discord.js";

import { Config } from "../types/Config.js";
import config from "../config.js";
import Functions from "../core/Functions.js";

import axios, { Axios } from "axios";
import mongoose, { Mongoose } from "mongoose";
import WrapBlox from "wrapblox";
import Threader from "../core/Threader.js";

class SuperClient extends Client {
    Start = new Date();

    //? Imports
    config: Config = config;
    Functions: Functions
	Threader: Threader;

    //? Dependencies
    Axios: Axios = axios;
    Mongoose: Mongoose = mongoose;
    WrapBlox: WrapBlox = new WrapBlox();

    //? Properties
    Arguments: string[] = process.argv.slice(2);
    AttachedChannels: { [key: string]: TextChannel } = {};

    //? Variables
    devMode: boolean = this.Arguments.includes("--dev");
	MemoryUsage: number[] = [];

    //* Log Functions
	Log = async (type : "error" | "success" | "info" | "verbose" | "warn" | "deprecated", message : unknown, useDate?: boolean): Promise<undefined> => {
		try {
			const stack = new Error().stack as string
			const stackArray = stack.split("\n");
			let stackline = stackArray[2]; // "		at FUNCTION (file:///FULLPATH:LINE:COL)"
			// remove the "		at " at the start
			stackline = stackline.replace("    at ", "");

			const stacklineArray = stackline.split(" ");
			let FunctionName: string | undefined = stacklineArray[0];
			// console.log(stacklineArray)
			let Path = stacklineArray[1] || stacklineArray[0]; // (file:///FULLPATH:LINE:COL)
			if (!Path) {
				Path = stacklineArray[0];
				FunctionName = undefined;
			}

			// Remove everything but the last part
			const PathArray = Path.split("/");
			Path = PathArray[PathArray.length - 1];
			// Remove the last ")"
			Path = Path.replace(")", "");

			let infoline: string;
			if (this.devMode && FunctionName) {
				infoline = `${FunctionName} at ${Path}`;
			} else {
				infoline = Path;
			}


			if (typeof message === "object") {
				message = JSON.stringify(message, null, 2);
			}
			let fullMessage = `[${type.toUpperCase()}] (${infoline}) ${message}`;
			if (useDate === true || useDate === undefined) {
				fullMessage += ` at ${new Date().toLocaleString()}`;
			}
			if (this.config.logConfig[type] === undefined) return this.Log("error", `Invalid log type ${type}`);
			console.log(this.config.logConfig[type].color(fullMessage))
		} catch (error: unknown) {
			console.error(error)
		}
	}

	log = async (message: unknown, useDate?: boolean) => {
		this.Log("info", message, useDate);
	};

	warn = async (message: unknown, useDate?: boolean) => {
		this.Log("warn", message, useDate);
	};

	error = async (message: unknown, useDate?: boolean) => {
		this.Log("error", message, useDate);
	};

	success = async (message: unknown, useDate?: boolean) => {
		this.Log("success", message, useDate);
	};

	verbose = async (message: unknown, useDate?: boolean) => {
		if (!this.devMode) return;
		this.Log("verbose", message, useDate);
	};

    Startup = async () => {
        this.log(`Starting up Ametron v${this.config.version}`);

        if (this.devMode) {
            this.warn("Running in development mode");

            this.config.baseURL = `http://localhost:${this.config.port}/`;

            this.config.credentials.discordToken = process.env.Dev_discordToken as string;
            this.config.credentials.robloxCookie = process.env.robloxCookie as string;
            this.config.credentials.databaseURL = process.env.Dev_databaseURL as string;
        } else {
            this.config.credentials.discordToken = process.env.discordToken as string;
            this.config.credentials.robloxCookie = process.env.robloxCookie as string;
            this.config.credentials.databaseURL = process.env.databaseURL as string;
        }
        this.config.credentials.encryptionKey = process.env.encryptionKey as string;

		await this.Functions.Init();

        this.success(`Started up in ${new Date().getTime() - this.Start.getTime()}ms`);
    }

    constructor(options: ClientOptions) {
        super(options);

        this.Functions = new Functions(this);
		this.Threader = new Threader(this);
    }
}

export default SuperClient;