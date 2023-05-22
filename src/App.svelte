<script lang="ts">
    import Player from "@components/Player.svelte";
    import Track from "@components/Track.svelte";
    import Queue from "@components/Queue.svelte";
    import Search from "@components/Search.svelte";
    import { getChannels, setGuildID } from "@lib/api";

    let track = null
    let queue = []
    let channel = null
    let debug = null
    let voiceChannels = []
    let playing = false
    
    setGuildID(new URLSearchParams(window.location.search).get("guild"))

    getChannels().then(data => {
        voiceChannels = data.voice
    })
</script>

<div class="grid grid-cols-[auto_30%] grid-rows-1 gap-6 grid-cols-2 p-6 h-full">
    <div class="area flex flex-col h-full p-4 gap-4">
        <Search />
        <Queue {queue} {debug} {voiceChannels} {playing} {track}/>
    </div>
    <div class="area flex flex-col h-full overflow-clip p-4 gap-4">
        {#if channel}
            <p class="text-zinc-400">Currently playing in {channel.name}: </p>
        {/if}
        <Track {track} />
    </div>
    <Player bind:track bind:queue bind:channel bind:debug bind:playing/>
</div>

