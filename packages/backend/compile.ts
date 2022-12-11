import esbuild from "esbuild";
import { deleteSync } from "del";
import chalk from "chalk";
import pkg from "./package.json" assert { type: "json" };

deleteSync("./dist");

esbuild
    .build({
        entryPoints: ["./src/index.ts"],
        outfile: "./dist/index.js",
        format: "esm",
        platform: "node",
        bundle: true,
        external: Object.keys(pkg.dependencies),
        minify: true,
        sourcemap: true,
    })
    .catch((e) => {
        console.error(chalk.red(e));
    });
