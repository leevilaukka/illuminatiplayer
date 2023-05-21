<script lang="ts">
    import { LoopMode, postClear, postJump, postLoop, postMove, postRemove, postShuffle, postToTop, setChannelID} from "@lib/api";
    import Icon from "./Icon.svelte";
    import Debug from "./Debug.svelte";

    export let queue: any = []
    export let debug: Debug = null
    export let voiceChannels = []
    export let playing = false;
    
    let showDebug = false
    let dragFrom = null
    let dragTo = null

    const handlePlay = (_e: MouseEvent, idx: number) => {
        postJump(idx)
    }

    const handleRemove = (_e: MouseEvent, idx: number) => {
        postRemove(idx)
    }

    const handleToTop = (_e: MouseEvent, idx: number) => {
        postToTop(idx)
    }

    const handleShuffle = async () => {
        const res = await postShuffle()
        queue = res.queue
    }

    const handleClear = () => {
        postClear()
    }

    const handleDragStart = (e: DragEvent, idx: number) => {
        dragFrom = idx
    }

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = async (e: DragEvent, index: number) => {
        dragTo = index
        
        if(dragFrom == dragTo) return

        await postMove(dragFrom, dragTo)
    }

    const handleRepeat = () => {
        postLoop(LoopMode.TRACK)
    }

    const handleChannelSelect = (e: Event) => {
        const target = e.target as HTMLSelectElement
        const channelID = target.value
        console.log(channelID)
        
        setChannelID(channelID)
    }

    function getTotalDuration() {
        const seconds = queue.reduce((acc, cur) => acc + cur.durationMS, 0) / 1000
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        return `${ days > 0 ? `${days}d` : ""} ${hours > 0 ? `${hours % 24}h` : ""} ${minutes > 0 ? `${minutes % 60}m` : ""} ${seconds % 60}s`
    }
</script>

<div class="flex flex-col flex-auto gap-4 overflow-hidden">
    {#if queue.length > 0}
        <div class="flex flex-col flex-auto gap-4 overflow-auto">
            <table class="border-separate border-spacing-y-2">
                <thead class="sticky top-0 bg-zinc-900">
                    <th>
                        <div class="flex items-center justify-center">
                            <Icon name="hash" class="text-zinc-400"/>
                        </div>
                    </th>
                    <th class="max-w-[24px]">
                        <div class="flex items-center justify-center">
                            <Icon name="image" class="text-zinc-400" />
                        </div>
                    </th>
                    <th class="px-4 text-start text-zinc-400">
                        <div class="flex items-center justify-start gap-2">
                            <Icon name="disc" class="text-zinc-400" />
                            <p>Track</p>
                        </div>
                    </th>
                    <th class="text-center text-zinc-400">
                        <div class="flex items-center justify-center">
                            <Icon name="clock" class="text-zinc-400" />
                        </div>
                    </th>
                    <th class="text-center text-zinc-400">
                        Controls
                    </th>
                </thead>
                <tbody>
                    {#each queue as track, index}
                        <tr draggable="true" on:dragover={(e) => handleDragOver(e)} on:dragstart={(e) => handleDragStart(e, index)} on:drop={(e) => handleDrop(e, index)} class="bg-zinc-800" title="{track.title} | {track.author}" >
                            <td class="text-center rounded-s">
                                <p class="text-zinc-400">{index + 1}</p>
                            </td>
                            <td>
                                <div class="flex items-center justify-center">
                                    <img src="{track.thumbnail}" alt="" class="block w-12 h-12">
                                </div>
                            </td>
                            <td>
                                <div class="flex flex-col gap-1 px-4">
                                    <h3 class="text-lg">{track.title}</h3>
                                    <p class="text-zinc-400">{track.author}</p>
                                </div>
                            </td>
                            <td class="text-center">
                                <p class="text-zinc-400">{track.duration}</p>
                            </td>
                            <td class="rounded-e max-w-max">
                                <div class="flex flex-row flex-nowrap justify-center gap-4">
                                    <button title="Play Now" on:click={(e) => handlePlay(e, index)}>
                                        <Icon name="play" />
                                    </button>
                                    <button title="Remove from Queue" on:click={(e) => handleRemove(e, index)}>
                                        <Icon name="trash" />
                                    </button>
                                    <button title="Move to Top" on:click={(e) => handleToTop(e, index)}>
                                        <Icon name="chevrons_up" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <p class="m-auto">Jono tyhjä!</p>
    {/if}
    
    {#if !playing && queue.length === 0}
        <select name="channel" class="w-full px-3 py-1 rounded-s bg-zinc-800" id="" on:change={handleChannelSelect}>
            <option value="" selected disabled>Select a channel</option>
            {#each voiceChannels as channel}
                <option value={channel.id}>{channel.name}</option>
            {/each}
        </select>
    {/if}

    {#if showDebug && debug}
            <Debug {debug} />
    {/if}
    
    <div class="flex flex-row gap-4">
        <button on:click={handleShuffle} title="Shuffle Queue" class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800"><Icon name="shuffle"/> Shuffle</button>
        <button on:click={handleRepeat} class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800"><Icon name="repeat" /> Repeat</button>
        <button on:click={handleClear} title="Clear Queue" class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800"><Icon name="trash" /> Clear</button>
        <button on:click={() => showDebug = !showDebug} class="flex ml-auto items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800"><Icon name="activity"/>Debug</button>
        {#if queue.length > 0}
            <p class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800" title="{getTotalDuration()}">{queue.length} songs</p>
        {/if}
        <Debug  />
    </div>
</div>