import { Type } from "@sinclair/typebox";

const usernamePattern = Type.String({
    minLength: 2,
    maxLength: 128,
});

const passwordPattern = Type.String({
    minLength: 8,
    maxLength: 128,
    // pattern:
    //     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$",
});

const userTypePattern = Type.Union([
    Type.Literal("admin"),
    Type.Literal("superAdmin"),
    Type.Literal("student"),
]);

const objectIdPattern = Type.String({
    minLength: 24,
    maxLength: 24,
});

export { usernamePattern, passwordPattern, userTypePattern, objectIdPattern };
