import bs from "browser-sync";
import esbuild from "esbuild";
import chalk from "chalk";
import config from "./esbuild.js";

await esbuild
    .build({
        ...config,
        incremental: true,
        watch: true,
        define: {
            "process.env.NODE_ENV": "'development'",
        },
    })
    .catch((e) => {
        console.error(chalk.red(e));
        // process.exit(1);
    });

const port = 10050;
chalk.cyan(`Launching dev server at port ${port}`);

bs.init({
    startPath: "/",
    port,
    logLevel: "warn",
    logFileChanges: true,
    notify: true,
    single: true,
    server: {
        baseDir: "dist",
        index: "index.html",
    },
    files: "src/",
});
