import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const LoginRequest = Type.Object({
    username: Type.String({ minLength: 2, maxLength: 128 }),
    password: Type.String({
        minLength: 8,
        maxLength: 128,
        // pattern:
        //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
    }),
});
type LoginRequestType = Static<typeof LoginRequest>;

const LoginResponse = Type.Object({
    username: Type.String(),
    uid: Type.Integer(),
});
type LoginResponseType = Static<typeof LoginResponse>;

const login = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: LoginRequestType;
        Reply: LoginResponseType;
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
            const { username } = request.body;
            username;
            void response.status(201).send({ username, uid: 0 });
        },
    );
};

export default login;
