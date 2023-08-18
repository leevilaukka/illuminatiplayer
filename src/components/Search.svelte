<script lang="ts">
    import { getAutoComplete, postFilePlay, postSong } from "@lib/api";
    import Icon from "@components/Icon.svelte"

    let query = ""
    let autoComplete = []
    let autoCompleteShow = false

    const handleSearch = (e: SubmitEvent | InputEvent | DragEvent ) => {        
        e.preventDefault()
        if(e.type == "drop" && e instanceof DragEvent) {
            if (e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0] as File
                if(!file.type.startsWith("audio/")) return alert("File must be an audio file")
                postFilePlay(file)
                return
            }
            else query = e.dataTransfer.getData("text/plain")
        } 
        
        postSong(query)
        query = ""
    }

    const handleAutoComplete = (e) => {
        query = e.target.value

        if(query.length < 3) return autoCompleteShow = false
        
        getAutoComplete(query).then((res) => {
            autoComplete = res.results
            autoCompleteShow = true
        })
    }
</script>

<form class="flex flex-row" on:submit={handleSearch}>
    <input on:drop={handleSearch} on:input={handleAutoComplete} bind:value={query} type="text" class="w-full px-3 py-1 rounded-s bg-zinc-800" placeholder="Search for a song or enter playlist url...">
    <button type="submit" class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded-e bg-emerald-600">
        <Icon name="plus" /> Add to queue
    </button>
</form>

<div class="relative w-full">
    {#if autoCompleteShow}
        <ul class="absolute z-10 w-full bg-zinc-800 rounded-b mt-1">
            {#each autoComplete as song}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li class="px-3 py-1 hover:bg-zinc-700" on:click={() =>{
                    postSong(song.url)
                    query = ""
                    autoComplete = []
                    autoCompleteShow = false
                }}>
                    <div class="flex flex-row gap-2 items-center">
                        <img src="{song.thumbnail}" alt="" width="40" height="40" class="rounded">
                        <p class="text-lg">{song.title}</p>
                        <p class="text-zinc-400">{song.author}</p>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>

