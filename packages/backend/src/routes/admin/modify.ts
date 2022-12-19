import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { verifyJwt, verifyPwd } from "../../utils/crypto.js";
import httpErrors from "http-errors";
import getAdmin from "../../utils/admin/get.js";
import setAdmin from "../../utils/admin/set.js";
import {
    objectIdPattern,
    passwordPattern,
    usernamePattern,
} from "../../utils/patterns.js";
import getSuperAdminsCount from "../../utils/admin/supers.js";

const ModifyRequest = Type.Object({
    adminId: Type.Optional(objectIdPattern),
    newUsername: Type.Optional(usernamePattern),
    password: Type.Optional(passwordPattern),
    newPassword: Type.Optional(passwordPattern),
    newIsSuperAdmin: Type.Optional(Type.Boolean()),
});
type ModifyRequestType = Static<typeof ModifyRequest>;

const ModifyResponse = Type.Object({
    adminId: Type.Optional(Type.String()),
    username: Type.String(),
    passwordChanged: Type.Boolean(),
    isSuperAdmin: Type.Boolean(),
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
            const {
                adminId,
                newUsername,
                password,
                newPassword,
                newIsSuperAdmin,
            } = request.body;
            const userId =
                verifyJwt(request.headers.authorization || "")?.id || "";
            let admin = await getAdmin(userId);
            if (!admin) {
                return response
                    .status(404)
                    .send(httpErrors.NotFound(`Admin ${userId} not found`));
            }
            if (!admin.isSuperAdmin) {
                if (
                    newIsSuperAdmin ||
                    !password ||
                    !(await verifyPwd(admin.password, password))
                )
                    return response
                        .status(403)
                        .send(
                            httpErrors.Forbidden("You need to be superAdmin."),
                        );
            } else {
                if (adminId) {
                    admin = await getAdmin(adminId);
                    if (!admin) {
                        return response
                            .status(404)
                            .send(
                                httpErrors.NotFound(
                                    `Admin ${adminId} not found`,
                                ),
                            );
                    }
                }
                if (
                    newIsSuperAdmin === false &&
                    (await getSuperAdminsCount()) <= 1
                ) {
                    return response
                        .status(400)
                        .send(
                            httpErrors.BadRequest(
                                "Cannot remove last Super Admin",
                            ),
                        );
                }
            }
            await setAdmin(admin, {
                username: newUsername,
                password: newPassword,
            });
            return response.status(201).send({
                id: admin._id.toString(),
                username: newUsername || admin.username,
                passwordChanged: newPassword !== undefined,
                isSuperAdmin:
                    newIsSuperAdmin !== undefined
                        ? newIsSuperAdmin
                        : admin.isSuperAdmin,
            });
        },
    );
};

export default modify;
