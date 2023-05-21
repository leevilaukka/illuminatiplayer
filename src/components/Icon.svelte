<script>
    export let name = ""
</script>

<span class={"icon w-[1.2em] h-[1.2em]" + ($$restProps.class ? ` ${$$restProps.class}` : "")} >{name}</span>

<style lang="postcss">
    @font-face {
        font-family: 'feather';
        src: url('static/fonts/feather.woff2') format('woff2'),
            url('static/fonts/feather.woff') format('woff'),
            url('static/fonts/feather.ttf') format('truetype'),
            url('static/fonts/feather.svg#feather') format('svg');
        font-weight: normal;
        font-style: normal;
    }

    .icon {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: 'feather' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1.22em;
        font-size: 1.2em;

        /* Enable Ligatures ================ */
        letter-spacing: 0;
        -webkit-font-feature-settings: "liga";
        -moz-font-feature-settings: "liga=1";
        -moz-font-feature-settings: "liga";
        -ms-font-feature-settings: "liga" 1;
        font-feature-settings: "liga";
        -webkit-font-variant-ligatures: discretionary-ligatures;
        font-variant-ligatures: discretionary-ligatures;
        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>