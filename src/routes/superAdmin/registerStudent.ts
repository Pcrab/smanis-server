import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";
import getAdmin from "../../utils/admin/get.js";
import {
    objectIdPattern,
    passwordPattern,
    usernamePattern,
} from "../../utils/patterns.js";
import createStudent from "../../utils/student/create.js";

const RegisterStudentRequest = Type.Object({
    username: usernamePattern,
    password: passwordPattern,
    adminId: objectIdPattern,
});
type RegisterStudentRequestType = Static<typeof RegisterStudentRequest>;

const RegisterStudentResponse = Type.Object({
    id: Type.String(),
});
type RegisterStudentResponseType = Static<typeof RegisterStudentResponse>;

const registerStudent = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: RegisterStudentRequestType;
        Reply: RegisterStudentResponseType | httpErrors.HttpError;
    }>(
        "/registerStudent",
        {
            schema: {
                body: RegisterStudentRequest,
                response: {
                    201: RegisterStudentResponse,
                },
            },
        },
        async (request, response) => {
            const { username, password, adminId } = request.body;
            const admin = await getAdmin(adminId);
            if (!admin) {
                return response
                    .status(400)
                    .send(httpErrors.BadRequest("bad adminId"));
            }
            const student = await createStudent(username, password, admin);
            if (!student) {
                return response
                    .status(400)
                    .send(httpErrors.BadRequest("bad username or password"));
            }
            return response.status(201).send({ id: student._id.toString() });
        },
    );
};

export default registerStudent;
