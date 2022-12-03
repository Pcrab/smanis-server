import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import { studentModel } from "../../schemas/student.js";
import { encryptPwd, verifyJwt, verifyPwd } from "../../utils/crypto.js";
import httpErrors from "http-errors";

const ModifyRequest = Type.Object({
    newUsername: Type.Optional(Type.String({ minLength: 2, maxLength: 128 })),
    password: Type.String({
        minLength: 8,
        maxLength: 128,
        // pattern:
        //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
    }),
    newPassword: Type.Optional(
        Type.String({
            minLength: 8,
            maxLength: 128,
            // pattern:
            //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
        }),
    ),
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
            const objectId = new mongoose.Types.ObjectId(id);
            const student = await studentModel.findById(objectId).exec();
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
            if (newUsername) {
                student.username = newUsername;
            }
            if (newPassword) {
                student.password = await encryptPwd(newPassword);
            }
            await student.save();
            return response.status(201).send({
                id: student._id.toString(),
                username: student.username,
                passwordChanged: newPassword !== undefined,
            });
        },
    );
};

export default modify;
