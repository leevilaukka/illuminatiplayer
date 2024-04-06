<script lang="ts">
    import { getFilters, postFilterToggle } from "@lib/api";
    import Icon from "./Icon.svelte";
    let dialog: HTMLDialogElement;

    let filters = {
        disabled: [],
        enabled: []
    }

    getFilters().then(data => {
        filters = data.filters
    })

    const handleFilterChange = (value) => {
        postFilterToggle(value)

        getFilters().then(data => {
            filters = data.filters
        })
    }
</script>

<button class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800" on:click={() => dialog.showModal()}><Icon name="list"/> Filters </button>
<dialog bind:this={dialog}>
    <button on:click={() => dialog.close()}>
        <Icon name="x" class="bg-black-800"/>
    </button>
    <div class="rounded">
        {#each filters.disabled as filter}
            <button value={filter} on:click={() => handleFilterChange(filter)}>
                {filter}
            </button>
        {/each}
        <br/>
        {#each filters.enabled as filter}
            <button on:click={() => handleFilterChange(filter)}>
                {filter}
            </button>
        {/each}
    <div/>
</dialog>
