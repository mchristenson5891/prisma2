"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMutation = exports.PostQuery = exports.Post = void 0;
const nexus_1 = require("nexus");
exports.Post = nexus_1.objectType({
    name: "Post",
    definition(t) {
        t.int("id"); // <- Field named `id` of type `Int`
        t.string("title"); // <- Field named `title` of type `String`
        t.string("body"); // <- Field named `body` of type `String`
        t.boolean("published"); // <- Field named `published` of type `Boolean`
    },
});
exports.PostQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.field("drafts", {
            type: "Post",
            resolve(_root, _args, ctx) {
                return ctx.db.post.findMany({ where: { published: false } });
            },
        });
        t.list.field("posts", {
            type: "Post",
            resolve(_root, _args, ctx) {
                return ctx.db.post.findMany({ where: { published: true } });
            },
        });
    },
});
exports.PostMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createDraft", {
            type: "Post",
            args: {
                title: nexus_1.nonNull(nexus_1.stringArg()),
                body: nexus_1.nonNull(nexus_1.stringArg()),
            },
            resolve(_root, args, ctx) {
                const draft = {
                    title: args.title,
                    body: args.body,
                    published: false,
                };
                return ctx.db.post.create({ data: draft });
            },
        });
        t.field("publish", {
            type: "Post",
            args: {
                draftId: nexus_1.nonNull(nexus_1.intArg()),
            },
            resolve(_root, args, ctx) {
                return ctx.db.post.update({
                    where: { id: args.draftId },
                    data: {
                        published: true,
                    },
                });
            },
        });
    },
});
//# sourceMappingURL=Post.js.map