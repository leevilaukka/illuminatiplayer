import svelte from "rollup-plugin-svelte";
import preprocess from "svelte-preprocess";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import { spawn } from "child_process";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import replace from "@rollup/plugin-replace";

const PRODUCTION = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = spawn("npm", ["run", "sirv", "--", "--dev"], {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            });

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

export default [
    {
        input: "src/index.ts",
        output: {
            format: "esm",
            dir: PRODUCTION ? "build" : "dev",
            sourcemap: !PRODUCTION,
        },
        plugins: [
            // Svelte plugin
            svelte({
                compilerOptions: {
                    dev: !PRODUCTION,
                    sourcemap: !PRODUCTION,
                },

                emitCss: true,

                // Process typescript + postcss (tailwind) in svelte components
                preprocess: preprocess(),
            }),

            copy({
                targets: [
                    {
                        src: "src/index.html",
                        dest: PRODUCTION ? "build" : "dev",
                    },
                    {
                        src: "src/static",
                        dest: PRODUCTION ? "build" : "dev",
                    },
                ],
            }),

            replace({
                __ENV__: PRODUCTION
                    ? JSON.stringify("PRODUCTION")
                    : JSON.stringify("DEVELOPMENT"),
                __DISCORD_CLIENT_ID__ : PRODUCTION 
                    ? "670016290840379411" // PROD
                    : "729712438466838631" // DEV
            }),

            alias({
                entries: [
                    {
                        find: "@components",
                        replacement: "src/components",
                    },
                    {
                        find: "@lib",
                        replacement: "src/lib",
                    },
                ],
            }),

            // Process postcss (tailwind) elsewhere
            postcss({
                extract: "bundle.css",
            }),

            // Resolve dependencies
            resolve({
                browser: true,
            }),
            commonjs(),

            typescript({
                sourceMap: !PRODUCTION,
                tsconfig: "./tsconfig.json",
            }),

            !PRODUCTION && serve(),
            !PRODUCTION && livereload(),

            // Minimize bundle
            PRODUCTION &&
                terser({
                    compress: {
                        drop_console: PRODUCTION,
                    },
                }),
        ],
    },
];
