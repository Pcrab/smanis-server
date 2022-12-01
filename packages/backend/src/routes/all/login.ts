import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import httpErrors from "http-errors";
import { adminModel } from "../../schemas/admin.js";
import { studentModel } from "../../schemas/student.js";
import { signJwt, verifyPwd } from "../../utils/crypto.js";

const LoginRequest = Type.Object({
    id: Type.String({ minLength: 12, maxLength: 24 }),
    password: Type.String({
        minLength: 8,
        maxLength: 128,
        // pattern:
        //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
    }),
    type: Type.Union([
        Type.Literal("admin"),
        Type.Literal("superAdmin"),
        Type.Literal("student"),
    ]),
});
type LoginRequestType = Static<typeof LoginRequest>;

const LoginResponse = Type.Object({
    token: Type.String(),
});
type LoginResponseType = Static<typeof LoginResponse>;

const login = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: LoginRequestType;
        Reply: LoginResponseType | httpErrors.HttpError;
    }>(
        "/login",
        {
            schema: {
                body: LoginRequest,
                response: {
                    200: LoginResponse,
                },
            },
        },
        async (request, response) => {
            const { id, password, type } = request.body;
            let hash = "";
            const objectId = new mongoose.Types.ObjectId(id);
            if (type === "student") {
                const student = await studentModel.findById(objectId).exec();
                hash = student?.password || "";
            } else if (type === "admin" || type === "superAdmin") {
                const admin = await adminModel.findById(objectId).exec();
                hash = admin?.password || "";
            }
            if (await verifyPwd(hash, password)) {
                void response.status(200).send({ token: signJwt(id, type) });
            } else {
                // Login should not distinguish 404 or 400.
                void response
                    .status(400)
                    .send(httpErrors.BadRequest("Wrong id or password"));
            }
        },
    );
};

export default login;
