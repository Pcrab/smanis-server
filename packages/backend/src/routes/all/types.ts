import { Static, Type } from "@sinclair/typebox";

export const BaseError = Type.Unknown();
export type BaseErrorType = Static<typeof BaseError>;

export const ErrorResponse = Type.Object({
    code: Type.Integer(),
    message: Type.Any(),
});

export type ErrorResponseType = Static<typeof ErrorResponse>;
