<script lang="ts">
    import { postControl } from "@lib/api";

    export let progress = null

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
        <p>{progress?.current.label || "0:00"}</p>
        <div class="h-2 w-full rounded-full overflow-clip">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <progress on:click={handleSeek} max=100 value={progress?.progress || 0}>
            </progress>
        </div>
        <p>{progress?.total.label || "00:00"}</p>
    </div>
