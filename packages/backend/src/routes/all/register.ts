import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const RegisterRequest = Type.Object({
    username: Type.String({ minLength: 2, maxLength: 128 }),
    password: Type.String({
        minLength: 8,
        maxLength: 128,
        // pattern:
        //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
    }),
});
type RegisterRequestType = Static<typeof RegisterRequest>;

const RegisterResponse = Type.Object({
    username: Type.String(),
    uid: Type.Integer(),
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
            const { username } = request.body;
            username;
            void response.status(201).send({ username, uid: 0 });
        },
    );
};

export default register;
