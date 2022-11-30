import * as dotenv from "dotenv";
import { encryptPwd, signJwt, verifyJwt, verifyPwd } from "./utils/crypto.js";
import initDb from "./utils/db.js";
import { fastify as Fastify } from "fastify";

// Init env
// Then can visit any defined variables in .env through process.env.VAR_NAME
dotenv.config();
// console.log(process.env.DB_URL);

// Test JWT
const jwt = signJwt({ payload: "payload" });
verifyJwt(jwt);
// Test PWD
const hash = await encryptPwd("password");
if (!(await verifyPwd(hash, "password"))) {
    throw "pwd error";
}

// Connecting to MongoDB
await initDb();

const fastify = Fastify({
    logger: {
        level: process.env.DEVELOPMENT === "true" ? "debug" : "info",
    },
});

fastify.get("/hello", () => {
    return { hello: "world" };
});

const port = 20080;
fastify.listen({ port }).catch((e) => {
    fastify.log.error(e);
    process.exit(1);
});

console.log(`Backend server started at port ${port}`);
