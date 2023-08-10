import { writable, get } from "svelte/store";

const BASE_URL =
    // @ts-ignore
    __ENV__ == "PRODUCTION" ? window.location.origin : "http://localhost:4000";

// TODO: Fetch from api
const GUILD_ID = writable<string>(null);
const CHANNEL_ID = writable<string>(null);

export function setGuildID(id: string) {
    GUILD_ID.set(id);
}

export function getGuildID() {
    return get(GUILD_ID);
}

export function setChannelID(id: string) {
    CHANNEL_ID.set(id);
}

export enum PlayerControl {
    RESUME = "resume",
    PAUSE = "pause",
    NEXT = "next",
    PREVIOUS = "previous",
    SKIP = "skip",
}

export enum LoopMode {
    OFF = 0,
    TRACK = 1,
    QUEUE = 2,
    AUTOPLAY = 3,
}

type Progress = {
    current: {
        label: string;
        value: number;
    };
    total: {
        label: string;
        value: number;
    };
    progress: number;
};

type CurrentlyPlaying = {
    playing: boolean;
    track: Track;
    progress: Progress;
    queue: Queue;
    channel: unknown;
};

export type Track = {
    title: string;
    id: string;
    url: string;
    thumbnail: string;
    durationMS: number;
    duration: string;
    author: string;
};

export type Queue = {
    tracks: Track[];
    current: Track;
    progress: Progress;
};

const getURL = (path: string) => new URL("/api" + path, BASE_URL);

export function getEvents() {
    return new EventSource(getURL("/music/events/") + getGuildID());
}

export async function getStatus() {
    const url = getURL(`/status/`);
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function getGuilds() {
    const url = getURL(`/guilds/`);
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function getIlluminatiUser(userID: string) {
    const url = getURL(`/user/${userID}`);
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function getChannels() {
    const url = getURL(`/guilds/${get(GUILD_ID)}/channels/`);
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function getCurrentlyPlaying(): Promise<CurrentlyPlaying> {
    const url = getURL(`/music/now-playing/${get(GUILD_ID)}`);
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function getQueue() {
    const url = getURL(`/music/queue/${get(GUILD_ID)}`);
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function getFilters() {
    const url = getURL(`/music/${get(GUILD_ID)}/filters/`);
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postFilterToggle(filter: string) {
    const url = getURL(`/music/filters/toggle`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            filter,
            guildID: get(GUILD_ID),
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postControl(action: string, data?: any) {
    const url = getURL(`/music/controls/${get(GUILD_ID)}`);

    const body = {
        action,
        data,
    };

    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    return await response.json();
}

export async function postSong(query: string | URL) {
    const url = getURL(`/music/play/`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            channelID: get(CHANNEL_ID),
            query,
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postJump(index: number) {
    const url = getURL(`/music/jump/`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            index,
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postPrevious(preserveCurrent?: boolean) {
    const url = getURL(`/music/previous/`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            preserveCurrent,
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postRemove(index: number) {
    const url = getURL(`/music/remove/`);
    const options = {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            track: index,
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postClear() {
    const url = getURL(`/music/clear/`);
    const options = {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postShuffle() {
    const url = getURL(`/music/shuffle/`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postLoop(mode: LoopMode) {
    const url = getURL(`/music/repeat/`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            mode,
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postMove(from: number, to: number) {
    const url = getURL(`/music/move/`);
    const options = {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            from,
            to,
        }),
    };

    const response = await fetch(url, options);
    return await response.json();
}

export async function postToTop(index: number) {
    const url = getURL(`/music/top/`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            track: index,
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postVolume(volume: number) {
    const url = getURL(`/music/volume/${get(GUILD_ID)}`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            volume,
        }),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export async function postSave() {
    const url = getURL(`/music/playlists/save/`);

    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            guildID: get(GUILD_ID),
            name: "test",
        }),
    };

    const response = await fetch(url, options);
    return await response.json();
}

export async function getDiscordUser(token: string) {
    const url = "https://discord.com/api/users/@me";
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(url, options);
    return await response.json();
}

export async function getDiscordGuilds(token: string) {
    const url = "https://discord.com/api/users/@me/guilds";
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(url, options);
    return await response.json();
}

export async function getAutoComplete(query: string) {
    const url = getURL(`/music/autocomplete/`);
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            guildID: get(GUILD_ID),
        }),
    };

    const response = await fetch(url, options);
    return await response.json();
}
