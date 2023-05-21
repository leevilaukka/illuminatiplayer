<script lang="ts">
    import { postSong } from "@lib/api";
    import Icon from "@components/Icon.svelte"

    let query = ""

    const handleSearch = (e) => {
        if(e.type == "drop") {
            query = e.dataTransfer.getData("text/plain")
        }
        
        e.preventDefault()
        console.log(query)
        postSong(query)
        query = ""
    }
</script>

<form class="flex flex-row" on:submit={handleSearch}>
    <input on:drop={handleSearch} bind:value={query} type="text" class="w-full px-3 py-1 rounded-s bg-zinc-800" placeholder="Search for a song or enter playlist url...">
    <button type="submit" class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded-e bg-emerald-600">
        <Icon name="plus" /> Add to queue
    </button>
</form>