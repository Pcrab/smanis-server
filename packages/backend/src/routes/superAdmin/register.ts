import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { adminModel } from "../../schemas/admin.js";
import { studentModel } from "../../schemas/student.js";
import { encryptPwd } from "../../utils/crypto.js";

const RegisterRequest = Type.Object({
    username: Type.String({ minLength: 2, maxLength: 128 }),
    password: Type.String({
        minLength: 8,
        maxLength: 128,
        // pattern:
        //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
    }),
    type: Type.Union([Type.Literal("admin"), Type.Literal("student")]),
});
type RegisterRequestType = Static<typeof RegisterRequest>;

const RegisterResponse = Type.Object({
    id: Type.String(),
});
type RegisterResponseType = Static<typeof RegisterResponse>;

const register = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: RegisterRequestType;
        Reply: RegisterResponseType;
    }>(
        "/register",
        {
            schema: {
                body: RegisterRequest,
                response: {
                    201: RegisterResponse,
                },
            },
        },
        async (request, response) => {
            const { username, password, type } = request.body;
            const Model = type === "student" ? studentModel : adminModel;
            const user = new Model({
                username,
                password: await encryptPwd(password),
            });
            await user.save();
            void response.status(201).send({ id: user._id.toString() });
        },
    );
};

export default register;
