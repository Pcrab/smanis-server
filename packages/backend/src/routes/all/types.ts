import { Static, Type } from "@sinclair/typebox";

export const BaseError = Type.Unknown();
export type BaseErrorType = Static<typeof BaseError>;

export const ErrorResponse = Type.Object({
    code: Type.Integer(),
    message: Type.Any(),
});

export type ErrorResponseType = Static<typeof ErrorResponse>;

export const RegisterRequest = Type.Object({
    username: Type.String({ minLength: 2, maxLength: 128 }),
    password: Type.String({
        minLength: 8,
        maxLength: 128,
        // pattern:
        //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
    }),
});

export type RegisterRequestType = Static<typeof RegisterRequest>;

export const RegisterResponse = Type.Object({
    username: Type.String({ minLength: 2, maxLength: 128 }),
    uid: Type.Integer(),
});

export type RegisterResponseType = Static<typeof RegisterResponse>;
