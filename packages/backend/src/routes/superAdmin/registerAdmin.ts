import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";
import { passwordPattern, usernamePattern } from "../../utils/patterns.js";
import createAdmin from "../../utils/admin/create.js";

const RegisterAdminRequest = Type.Object({
    username: usernamePattern,
    password: passwordPattern,
    isSuperAdmin: Type.Boolean(),
});
type RegisterAdminRequestType = Static<typeof RegisterAdminRequest>;

const RegisterAdminResponse = Type.Object({
    id: Type.String(),
});
type RegisterAdminResponseType = Static<typeof RegisterAdminResponse>;

const registerAdmin = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: RegisterAdminRequestType;
        Reply: RegisterAdminResponseType | httpErrors.HttpError;
    }>(
        "/registerAdmin",
        {
            schema: {
                body: RegisterAdminRequest,
                response: {
                    201: RegisterAdminResponse,
                },
            },
        },
        async (request, response) => {
            const { username, password, isSuperAdmin } = request.body;
            const admin = await createAdmin(username, password, isSuperAdmin);
            if (!admin) {
                return response
                    .status(400)
                    .send(
                        httpErrors.BadRequest(
                            "bad username or password or isSuperAdmin",
                        ),
                    );
            }
            return response.status(201).send({ id: admin._id.toString() });
        },
    );
};

export default registerAdmin;
