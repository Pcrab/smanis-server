import * as dotenv from "dotenv";
// Init env
// Then can visit any defined variables in .env through process.env.VAR_NAME
dotenv.config();
// Finish init
import initDb from "./utils/db.js";
import { fastify as Fastify } from "fastify";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";
import multipart from "@fastify/multipart";
import cors from "@fastify/cors";

import adminRoute from "./routes/admin/index.js";
import { encryptPwd, signJwt, verifyJwt, verifyPwd } from "./utils/crypto.js";
import allRoute from "./routes/all/index.js";
import superAdminRoute from "./routes/superAdmin/index.js";
import studentRoute from "./routes/student/index.js";
import isProduction from "./utils/isProduction.js";
import { studentModel } from "./schemas/student.js";
import { adminModel } from "./schemas/admin.js";
import { examModel } from "./schemas/exam.js";
import client from "./utils/oss.js";

// console.log(process.env.DB_URL);

// Test oss
client;

// Test JWT
const jwt = signJwt("id", "type");
const result = verifyJwt(jwt);
if (result?.id !== "id" || result?.type !== "type") {
    throw "jwt error";
}
// Test PWD
const hash = await encryptPwd("password");
if (!(await verifyPwd(hash, "password"))) {
    throw "pwd error";
}

// Connecting to MongoDB
await initDb();

// Init test accounts
if (!isProduction()) {
    if (
        (await examModel.find().exec()).length === 0 &&
        (await studentModel.find({ username: "testStudent" }).exec()).length ===
            0 &&
        (
            await adminModel
                .find({
                    username: "testAdmin",
                    isSuperAdmin: false,
                })
                .exec()
        ).length === 0 &&
        (
            await adminModel
                .find({ username: "testSuperAdmin", isSuperAdmin: true })
                .exec()
        ).length === 0
    ) {
        const admin = new adminModel({
            username: "testAdmin",
            password: await encryptPwd("testPassword"),
            students: await studentModel.find().exec(),
        });
        await admin.save();

        const student1 = new studentModel({
            username: "testStudent",
            password: await encryptPwd("testPassword"),
            admin: admin,
        });
        await student1.save();

        const superAdmin = new adminModel({
            username: "testSuperAdmin",
            password: await encryptPwd("testPassword"),
            isSuperAdmin: true,
        });
        await superAdmin.save();

        const student2 = new studentModel({
            username: "testStudent",
            password: await encryptPwd("testPassword"),
            admin: superAdmin,
        });
        await student2.save();

        const exam1 = new examModel({
            video: "testVideoUrl",
            score: 0,
            student: student1,
        });
        await exam1.save();

        const exam2 = new examModel({
            video: "testVideoUrl",
            score: 0,
            student: student2,
        });
        await exam2.save();
    }
}

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
            // Following two functions should compile fine without type definitions,
            // but sometimes vscode will show error, so I have to declare
            // types here to avoid that.
            onRequest: (
                _request: unknown,
                _reply: unknown,
                next: () => unknown,
            ) => {
                next();
            },
            preHandler: (
                _request: unknown,
                _reply: unknown,
                next: () => unknown,
            ) => {
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

await fastify.register(multipart, { attachFieldsToBody: true });
await fastify.register(cors, {
    allowedHeaders: ["Content-Type", "Authorization"],
});

// Register routes
await fastify.register(adminRoute, { prefix: "/admin" });
await fastify.register(superAdminRoute, { prefix: "/super" });
await fastify.register(studentRoute, { prefix: "/student" });
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
