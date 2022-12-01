import * as dotenv from "dotenv";
import { encryptPwd, signJwt, verifyJwt, verifyPwd } from "./utils/crypto.js";
import initDb from "./utils/db.js";
import { fastify as Fastify } from "fastify";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";

import adminRoute from "./routes/admin/index.js";
import allRoute from "./routes/all/index.js";
import isProduction from "./utils/isProduction.js";

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

// Init fastify
export const fastify = Fastify({
    logger: {
        level: isProduction() ? "info" : "debug",
    },
});

// Init swagger and swagger-ui
if (!isProduction()) {
    // add Swagger and Test route
    await fastify.register(swagger);
    await fastify.register(swagger_ui, {
        routePrefix: "/documentation",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false,
        },
        uiHooks: {
            onRequest: function (_request, _reply, next) {
                next();
            },
            preHandler: function (_request, _reply, next) {
                next();
            },
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
    });
    fastify.get("/hello", () => {
        return { hello: "world" };
    });
}

// Register routes
await fastify.register(adminRoute);
await fastify.register(allRoute);

await fastify.ready();

// Start server
const port = parseInt(process.env.PORT || "20080");
const protocol = process.env.PROTOCOL || "http";
const host = process.env.HOST || "127.0.0.1";
const url = `${protocol}://${host}:${port}`;
fastify.listen({ port }).catch((e) => {
    fastify.log.error(e);
    process.exit(1);
});

console.log(`Backend server started at ${url}`);
