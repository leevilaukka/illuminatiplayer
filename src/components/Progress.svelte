<script lang="ts">
    import { postControl } from "@lib/api";

    export let progress = {
        total: {
            value: 0,
            label: "0:00"
        },
        current: {
            value: 0,
            label: "0:00"
        },
        progress: 0
    }

    const handleSeek = (e) => {
        const songLength = progress.total.value
        // Get the position of the click relative to the element
        const clickPosition = e.clientX - e.target.getBoundingClientRect().left

        // Get clicked percentage
        const percentage = (clickPosition / e.target.offsetWidth) * 100

        // Get the time in seconds
        const seconds = (songLength / 100) * percentage

        // Seek to the position
        postControl("seek", Math.floor(seconds))
    }

</script>

<div class="flex w-full items-center gap-4">
    <p>{progress.current.label}</p>
    <div class="h-2 w-full rounded-full overflow-clip">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <progress on:click={handleSeek} max=100 value={progress.progress}>
        </progress>
    </div>
    <p>{progress.total.label}</p>
</div>