export enum CommandError {
    DEVELOPER_ONLY = "DEVELOPER_ONLY",
    DISABLED_GLOBAL = "DISABLED_GLOBAL",

    MISSING_DISCORD_PERMISSIONS = "MISSING_DISCORD_PERMISSIONS",
    MISSING_PERMISSIONS = "MISSING_PERMISSIONS",

    DATABASE_ERROR = "DATABASE_ERROR",

    UNKNOWN = "UNKNOWN",
}

export enum CommandErrorDescription {
    DEVELOPER_ONLY = "This command is for Amethyst developers only",
    DISABLED_GLOBAL = "This command is currently disabled",

    MISSING_DISCORD_PERMISSIONS = "You are missing the required Discord permissions to run this command",
    MISSING_PERMISSIONS = "You are missing the required Amethyst permissions to run this command",

    DATABASE_ERROR = "An error occurred while trying to access the database",

    UNKNOWN = "An unknown error occurred",
}

export enum CommandModule {
    Points = "Points",
    Schedule = "Schedule",
    Roblox = "Roblox",
    Developer = "Developer",
}

export const HttpStatusCodes: { [key: number]: string } = {
    100: "CONTINUE",
    101: "SWITCHING_PROTOCOLS",
    102: "PROCESSING",
    200: "OK",
    201: "CREATED",
    202: "ACCEPTED",
    203: "NON_AUTHORITATIVE_INFORMATION",
    204: "NO_CONTENT",
    205: "RESET_CONTENT",
    206: "PARTIAL_CONTENT",
    207: "MULTI_STATUS",
    208: "ALREADY_REPORTED",
    226: "IM_USED",
    300: "MULTIPLE_CHOICES",
    301: "MOVED_PERMANENTLY",
    302: "FOUND",
    303: "SEE_OTHER",
    304: "NOT_MODIFIED",
    305: "USE_PROXY",
    307: "TEMPORARY_REDIRECT",
    308: "PERMANENT_REDIRECT",
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    402: "PAYMENT_REQUIRED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    406: "NOT_ACCEPTABLE",
    407: "PROXY_AUTHENTICATION_REQUIRED",
    408: "REQUEST_TIMEOUT",
    409: "CONFLICT",
    410: "GONE",
    411: "LENGTH_REQUIRED",
    412: "PRECONDITION_FAILED",
    413: "PAYLOAD_TOO_LARGE",
    414: "URI_TOO_LONG",
    415: "UNSUPPORTED_MEDIA_TYPE",
    416: "RANGE_NOT_SATISFIABLE",
    417: "EXPECTATION_FAILED",
    418: "IM_A_TEAPOT",
    421: "MISDIRECTED_REQUEST",
    422: "UNPROCESSABLE_ENTITY",
    423: "LOCKED",
    424: "FAILED_DEPENDENCY",
    425: "TOO_EARLY",
    426: "UPGRADE_REQUIRED",
    428: "PRECONDITION_REQUIRED",
    429: "TOO_MANY_REQUESTS",
    431: "REQUEST_HEADER_FIELDS_TOO_LARGE",
    451: "UNAVAILABLE_FOR_LEGAL_REASONS",
    500: "INTERNAL_SERVER_ERROR",
    501: "NOT_IMPLEMENTED",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
    505: "HTTP_VERSION_NOT_SUPPORTED",
    506: "VARIANT_ALSO_NEGOTIATES",
    507: "INSUFFICIENT_STORAGE",
    508: "LOOP_DETECTED",
    510: "NOT_EXTENDED",
    511: "NETWORK_AUTHENTICATION_REQUIRED",
};
