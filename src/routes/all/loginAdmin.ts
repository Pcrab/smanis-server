import { Type, Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";
import { signJwt, verifyPwd } from "../../utils/crypto.js";
import getAdmin from "../../utils/admin/get.js";
import { objectIdPattern, passwordPattern } from "../../utils/patterns.js";

const LoginAdminRequest = Type.Object({
    id: objectIdPattern,
    password: passwordPattern,
});
type LoginAdminRequestType = Static<typeof LoginAdminRequest>;

const LoginAdminResponse = Type.Object({
    id: Type.String(),
    username: Type.String(),
    isSuperAdmin: Type.Boolean(),
    token: Type.String(),
});
type LoginAdminResponseType = Static<typeof LoginAdminResponse>;

const loginAdmin = (fastify: FastifyInstance): void => {
    fastify.post<{
        Body: LoginAdminRequestType;
        Reply: LoginAdminResponseType | httpErrors.HttpError;
    }>(
        "/loginAdmin",
        {
            schema: {
                body: LoginAdminRequest,
                response: {
                    200: LoginAdminResponse,
                },
            },
        },
        async (request, response) => {
            try {
                const { id, password } = request.body;
                const admin = await getAdmin(id);
                if (!admin) throw "";
                const username = admin.username;
                const hash = admin.password;
                if (await verifyPwd(hash, password)) {
                    return response.status(200).send({
                        token: signJwt(id, "admin"),
                        id,
                        username,
                        isSuperAdmin: admin.isSuperAdmin,
                    });
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

export default loginAdmin;
