import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import { adminModel } from "../../schemas/admin.js";
import { encryptPwd } from "../../utils/crypto.js";
import httpErrors from "http-errors";

const ModifyRequest = Type.Object({
    adminId: Type.String({ minLength: 12, maxLength: 24 }),
    newUsername: Type.Optional(Type.String({ minLength: 2, maxLength: 128 })),
    newPassword: Type.Optional(
        Type.String({
            minLength: 8,
            maxLength: 128,
            // pattern:
            //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
        }),
    ),
    newIsSuperAdmin: Type.Optional(Type.Boolean()),
});
type ModifyRequestType = Static<typeof ModifyRequest>;

const ModifyResponse = Type.Object({
    adminId: Type.String(),
    username: Type.String(),
    passwordChanged: Type.Boolean(),
});
type ModifyResponseType = Static<typeof ModifyResponse>;

const modify = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: ModifyRequestType;
        Reply: ModifyResponseType | httpErrors.HttpError;
    }>(
        "/changeStudent",
        {
            schema: {
                body: ModifyRequest,
                response: {
                    201: ModifyResponse,
                },
            },
        },
        async (request, response) => {
            const { adminId, newUsername, newPassword, newIsSuperAdmin } =
                request.body;
            const adminObjectId = new mongoose.Types.ObjectId(adminId);
            const admin = await adminModel.findById(adminObjectId).exec();
            if (!admin) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound(`Admin ${adminId} not found`));
            }

            // Change Student Info
            if (newUsername) {
                admin.username = newUsername;
            }
            if (newPassword) {
                admin.password = await encryptPwd(newPassword);
            }
            if (newIsSuperAdmin) {
                admin.isSuperAdmin = newIsSuperAdmin;
            }
            await admin.save();
            return response.status(201).send({
                adminId,
                username: admin.username,
                passwordChanged: newPassword !== undefined,
            });
        },
    );
};

export default modify;
