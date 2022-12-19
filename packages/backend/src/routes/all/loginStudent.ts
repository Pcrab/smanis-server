import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";
import { signJwt, verifyPwd } from "../../utils/crypto.js";
import getStudent from "../../utils/student/get.js";
import { objectIdPattern, passwordPattern } from "../../utils/patterns.js";

const LoginStudentRequest = Type.Object({
    id: objectIdPattern,
    password: passwordPattern,
});
type LoginStudentRequestType = Static<typeof LoginStudentRequest>;

const LoginStudentResponse = Type.Object({
    id: Type.String(),
    username: Type.String(),
    token: Type.String(),
});
type LoginStudentResponseType = Static<typeof LoginStudentResponse>;

const loginStudent = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: LoginStudentRequestType;
        Reply: LoginStudentResponseType | httpErrors.HttpError;
    }>(
        "/loginStudent",
        {
            schema: {
                body: LoginStudentRequest,
                response: {
                    200: LoginStudentResponse,
                },
            },
        },
        async (request, response) => {
            try {
                const { id, password } = request.body;
                const student = await getStudent(id);
                if (!student) throw "";
                const username = student.username;
                const hash = student.password;
                if (await verifyPwd(hash, password)) {
                    return response
                        .status(200)
                        .send({ token: signJwt(id, "student"), id, username });
                } else throw "";
            } catch {
                // Login should not distinguish 404 or 400.
                return response
                    .status(400)
                    .send(httpErrors.BadRequest("Wrong id or password"));
            }
        },
    );
};

export default loginStudent;
