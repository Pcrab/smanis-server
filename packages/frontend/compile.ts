import esbuild from "esbuild";
import chalk from "chalk";
import config from "./esbuild.js";
import { deleteSync } from "del";

deleteSync("./dist/assets");

await esbuild
    .build({
        ...config,
        minify: true,
    })
    .catch((e) => {
        console.error(chalk.red(e));
    });

console.log(chalk.cyan("Compile finished!"));
