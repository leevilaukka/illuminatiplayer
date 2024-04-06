<script lang="ts">
    import Player from "@components/Player.svelte";
    import Track from "@components/Track.svelte";
    import Queue from "@components/Queue.svelte";
    import Search from "@components/Search.svelte";
    import { getChannels, setChannelID, setGuildID } from "@lib/api";
    import { DiscordSDK } from "@discord/embedded-app-sdk";

    //@ts-ignore will be replaced at build time
    const clientID = __DISCORD_CLIENT_ID__

    let track = null;
    let queue = [];
    let channel = null;
    let debug = null;
    let voiceChannels = [];
    let playing = false;
    let lastChannel;
    let discordSdk: DiscordSDK = null
    const searchParams = new URLSearchParams(window.location.search);

    setGuildID(searchParams.get("guild"));

    console.log(clientID)

    async function setupDiscordSdk() {
        await discordSdk.ready();
    }

    if (searchParams.get("frame_id")) {
        discordSdk = new DiscordSDK(clientID)

        setupDiscordSdk().then(() => {
            console.log("Discord SDK is ready");
            setGuildID(discordSdk.guildId)
            setChannelID(discordSdk.channelId)
        });
    }

    getChannels().then((data) => {
        voiceChannels = data.voice;
        lastChannel = data.lastUsed;
    });

    
</script>

<div class="grid grid-cols-[auto_30%] grid-rows-1 gap-6 grid-cols-2 p-6 h-full">
    <div class="area flex flex-col h-full p-4 gap-4">
        <Search />
        <Queue
            {queue}
            {debug}
            {voiceChannels}
            {playing}
            {track}
            {lastChannel}
        />
    </div>
    <div class="area flex flex-col h-full overflow-clip p-4 gap-4">
        {#if channel}
            <p class="text-zinc-400">Currently playing in {channel.name}:</p>
        {/if}
        <Track {track} />
    </div>
    <Player bind:track bind:queue bind:channel bind:debug bind:playing />
</div>
