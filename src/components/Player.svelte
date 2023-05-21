<svelte:options accessors={true} />

<script lang="ts">
    import { postControl, postPrevious, getGuildID, getCurrentlyPlaying, postVolume, postSeek, setChannelID, getEvents  } from "@lib/api";
    import Progress from "./Progress.svelte";
    import { createEventDispatcher } from "svelte"
    import Icon from "./Icon.svelte";
    import Debug from "./Debug.svelte";

    const dispatch = createEventDispatcher()

    const events = getEvents();

    export let track = null
    export let playing: boolean = false
    export let progress = null
    export let queue = []
    export let channel = null
    export let debug: Debug = null

    async function init() {
        const data = await getCurrentlyPlaying()
        playing = data?.playing || false
        track = data?.track || null
        progress = data?.progress
        channel = data?.channel || null
        setChannelID(channel?.id)
        return
    }

    let load = init

    function retry() {
        load = init
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (event) => {
        if(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
        if(event.key == "MediaPlayPause") pause()
        if(event.key == "MediaTrackNext") skip()
        if(event.key == "MediaTrackPrevious") prev()
    })



    $: navigator.mediaSession.playbackState = playing ? "playing" : "paused"
    $: navigator.mediaSession.metadata = track && new MediaMetadata({
        title: track?.title,
        artist: track?.author,
        album: track?.title,
        artwork: [
            { src: track?.thumbnail, sizes: "512x512", type: "image/png" }
        ]
    })
    navigator.mediaSession.setActionHandler("play", () => pause())
    navigator.mediaSession.setActionHandler("pause", () => pause())
    navigator.mediaSession.setActionHandler("previoustrack", () => prev())
    navigator.mediaSession.setActionHandler("nexttrack", () => skip())

    export function skip() {
        postControl("play")
        dispatch("skip", { track, progress, queue, playing })
    }

    export function pause() {
        (playing) ? postControl("pause") : postControl("resume")
    }

    export function stop() {
        postControl("stop")
    }

    export function prev() {
        postPrevious()
        dispatch("previous", { track, progress, queue })
    }

    export function handleVolume(e) {
        postVolume(e.target.value)
    }

    events.addEventListener("open", () => {
        events.addEventListener("message", (event) => {
            const data = JSON.parse(event.data)
            if(data.state == "pause") {
                playing = false
                track = data.track
            }
            if(data.state == "start" || data.state == "resume") {
                playing = true
                track = data.track                
            }
            if(data.state == "finish") {
                playing = false
                track = null
            }

            if("time" in data) progress = data.time
            if("queue" in data) queue = data.queue
            if("channel" in data) channel = data.channel;
            if("stats" in data) debug = data.stats 

            // Track is not updated when adding to queue
            if("track" in data && data.state != "add") track = data.track
        })
    })
</script>

{#await load()}
    <p>Loading...</p>
{:then}
    <div class="flex flex-col col-span-full gap-4">
        <div class="flex flex-row items-center justify-center gap-8 text-2xl">       
            <button on:click={prev}><Icon name="skip_back" /></button>
            <button on:click={pause} class="flex rounded-full p-2 bg-zinc-800">
                {#if playing}
                    <Icon name="pause" />
                {:else}
                    <Icon name="play" class="translate-x-[0.08em]" />
                {/if}
            </button>
            {#if queue.length === 0}
                <button on:click={stop}><Icon name="square" /></button> 
            {:else}
                <button on:click={skip}><Icon name="skip_forward" /></button>
            {/if}            
        </div>
        <Progress {progress}/>
    </div>
{:catch error}
    <p>{error}</p>
    <button on:click={retry}>Retry</button>
{/await}