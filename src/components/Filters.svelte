<script lang="ts">
    import { getFilters, postFilterToggle } from "@lib/api";
    import Icon from "./Icon.svelte";

    let filters = {
        disabled: [],
        enabled: []
    }

    getFilters().then(data => {
        filters = data.filters
    })

</script>

<div>
    {#each filters.enabled as filter}
        <button class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800" on:click={() => postFilterToggle(filter)}>
            <Icon name="check" />
            {filter}
        </button>
    {/each}
    {#each filters.disabled as filter}
        <button class="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded bg-zinc-800" on:click={() => postFilterToggle(filter)}>
            <Icon name="x" />
            {filter}
        </button>
    {/each}
</div>