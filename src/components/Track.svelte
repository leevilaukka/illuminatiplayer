<script lang="ts">
    import type { Track } from "@lib/api";

    export let track: Track = null
</script>



<div class="flex flex-col flex-auto gap-4">
    {#if track}
            <div class="aspect-square w-full bg-zinc-900 rounded overflow-clip">
                <img src={track.thumbnail} alt="" class="block w-full h-full rounded">
            </div>
            <h2 class="text-xl font-bold">{track.title}</h2>
            <p class="text-zinc-400">{track.author}</p>
    {:else}
        <p class="m-auto">Soita jotain saatana!</p>
    {/if}
</div>