<script lang="ts">
    type Debug = {
        queues: 
            {
                memoryUsage: {
                    heapTotal: number
                    heapUsed: number
                }
                latency: {
                    eventLoop: number
                }
                listeners: number
                versions: {
                    node: string
                    player: string
                }
            }[]
    } | null

    export let debug: Debug = null
</script>

<div class="flex gap-4 ">
    {#if debug}
        <p>Queues: {debug.queues.length}</p>
        <p>Memory: {(debug.queues[0].memoryUsage.heapTotal / 1_000_000).toFixed(2)} MB</p>
        <p>Heap: {(debug.queues[0].memoryUsage.heapUsed / 1_000_000).toFixed(2)} MB</p>
        <p>Latency: {debug.queues[0].latency.eventLoop.toFixed(3)} ms</p>
        <p>Listeners: {debug.queues[0].listeners}</p>
        <p>Node: {debug.queues[0].versions.node}</p>
        <p>Player: {debug.queues[0].versions.player}</p>
    {/if}
</div>