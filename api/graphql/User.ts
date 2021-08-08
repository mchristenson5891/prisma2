import { objectType, extendType, nonNull, intArg, stringArg } from "nexus";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";

import { rule } from "graphql-shield";

import { APP_SECRET, getUserId } from "../utils";

export const isAuthenticatedUser = rule()((_parent, _args, context) => {
  const userId = getUserId(context);
  return Boolean(userId);
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("password");

    t.field("juristion", {
      type: "Jurisdiction",
      resolve(root, args, ctx) {
        return ctx.db.user.findUnique({
          where: {
            id: Number(root.id),
          },
        }).juristion;
      },
    });
    t.nonNull.string("email");
  },
});

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.field("user", { type: "User" });
  },
});

export const Query = extendType({
  type: "Query",
  definition: (t) => {
    t.field("userById", {
      type: "User",
      args: { id: intArg() },
      resolve: (root, args, ctx) => ctx.db.user.getById(args.id),
    });

    t.nonNull.list.nonNull.field("getAllUsers", {
      type: "User",
      resolve: (root, args, ctx) => ctx.db.user.findMany(),
    });
    t.nullable.field("me", {
      type: "User",
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx);
        return ctx.db.user.findUnique({
          where: {
            id: Number(userId),
          },
        });
      },
    });
  },
});

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateRole", {
      type: "User",
      args: {
        role: stringArg(),
      },
      resolve: async (_parent, args, ctx) => {
        const userId = getUserId(ctx);
        return ctx.db.user.update({
          where: { id: userId },
          data: { role: args.role },
        });
      },
    });
    t.field("signup", {
      type: "AuthPayload",
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        role: stringArg(),
      },
      resolve: async (_parent, args, ctx) => {
        const hashedPassword = await hash(args.password, 10);
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
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });
  },
});
