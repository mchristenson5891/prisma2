"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = exports.AuthPayload = exports.User = exports.isAuthenticatedUser = void 0;
const nexus_1 = require("nexus");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const graphql_shield_1 = require("graphql-shield");
const utils_1 = require("../utils");
exports.isAuthenticatedUser = graphql_shield_1.rule()((_parent, _args, context) => {
    const userId = utils_1.getUserId(context);
    return Boolean(userId);
});
exports.User = nexus_1.objectType({
    name: "User",
    definition(t) {
        t.int("id");
        t.string("name");
        t.string("password");
        t.string("role");
        t.field("juristion", {
            type: "Jurisdiction",
            resolve(root, args, ctx) {
                return ctx.db.user.userById(root.id).juristion();
            },
        });
        t.nonNull.string("email");
    },
});
exports.AuthPayload = nexus_1.objectType({
    name: "AuthPayload",
    definition(t) {
        t.string("token");
        t.field("user", { type: "User" });
    },
});
exports.Query = nexus_1.extendType({
    type: "Query",
    definition: (t) => {
        t.field("userById", {
            type: "User",
            args: { id: nexus_1.intArg() },
            resolve: (root, args, ctx) => ctx.db.user.getById(args.id),
        });
        t.nonNull.list.nonNull.field("getAllUsers", {
            type: "User",
            resolve: (root, args, ctx) => ctx.db.user.findMany(),
        });
        t.nullable.field("me", {
            type: "User",
            resolve: (parent, args, ctx) => {
                const userId = utils_1.getUserId(ctx);
                return ctx.db.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                });
            },
        });
    },
});
exports.Mutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateRole", {
            type: "User",
            args: {
                role: nexus_1.stringArg(),
            },
            resolve: async (_parent, args, ctx) => {
                const userId = utils_1.getUserId(ctx);
                return ctx.db.user.update({
                    where: { id: userId },
                    data: { role: args.role },
                });
            },
        });
        t.field("signup", {
            type: "AuthPayload",
            args: {
                name: nexus_1.stringArg(),
                email: nexus_1.nonNull(nexus_1.stringArg()),
                password: nexus_1.nonNull(nexus_1.stringArg()),
                role: nexus_1.stringArg(),
            },
            resolve: async (_parent, args, ctx) => {
                const hashedPassword = await bcryptjs_1.hash(args.password, 10);
                const { name, email, role } = args;
                const user = await ctx.db.user.create({
                    data: {
                        name,
                        email,
                        role,
                        password: hashedPassword,
                    },
                });
                return {
                    token: jsonwebtoken_1.sign({ userId: user.id }, utils_1.APP_SECRET),
                    user,
                };
            },
        });
    },
});
//# sourceMappingURL=User.js.map