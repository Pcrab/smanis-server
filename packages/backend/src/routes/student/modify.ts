import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt, verifyPwd } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getStudent from "../../utils/student/get.js";
import setStudent from "../../utils/student/set.js";
import { passwordPattern, usernamePattern } from "../../utils/patterns.js";

const ModifyRequest = Type.Object({
    newUsername: Type.Optional(usernamePattern),
    password: passwordPattern,
    newPassword: Type.Optional(passwordPattern),
});
type ModifyRequestType = Static<typeof ModifyRequest>;

const ModifyResponse = Type.Object({
    id: Type.String(),
    username: Type.String(),
    passwordChanged: Type.Boolean(),
});
type ModifyResponseType = Static<typeof ModifyResponse>;

const modify = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: ModifyRequestType;
        Reply: ModifyResponseType | httpErrors.HttpError;
    }>(
        "/modify",
        {
            schema: {
                body: ModifyRequest,
                response: {
                    201: ModifyResponse,
                },
            },
        },
        async (request, response) => {
            const { newUsername, password, newPassword } = request.body;
            const id = verifyJwt(request.headers.authorization || "")?.id || "";
            const student = await getStudent(id);
            if (!student) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound(`User ${id} not found`));
            }
            if (!(await verifyPwd(student.password, password))) {
                return response
                    .status(401)
                    .send(httpErrors.Unauthorized(`Wrong password`));
            }
            await setStudent(student, {
                username: newUsername,
                password: newPassword,
            });
            // if (newUsername) {
            //     student.username = newUsername;
            // }
            // if (newPassword) {
            //     student.password = await encryptPwd(newPassword);
            // }
            // await student.save();
            return response.status(201).send({
                id: student._id.toString(),
                username: newUsername || student.username,
                passwordChanged: newPassword !== undefined,
            });
        },
    );
};

export default modify;
