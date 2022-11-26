import esbuild from "esbuild";
import { deleteSync } from "del";
import chalk from "chalk";

deleteSync("./dist");

esbuild
    .build({
        entryPoints: ["./src/index.ts"],
        outfile: "./dist/index.js",
        format: "esm",
        minify: true,
        sourcemap: true,
    })
    .catch((e) => {
        console.error(chalk.red(e));
    });
