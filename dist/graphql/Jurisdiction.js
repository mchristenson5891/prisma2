"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jurisdiction = void 0;
const nexus_1 = require("nexus");
exports.Jurisdiction = nexus_1.objectType({
    name: "Jurisdiction",
    definition(t) {
        t.int("id"); // <- Field named `id` of type `Int`
        t.string("name"); // <- Field named `title` of type `String`
        t.string("body"); // <- Field named `body` of type `String`
        t.boolean("published"); // <- Field named `published` of type `Boolean`
    },
});
//# sourceMappingURL=Jurisdiction.js.map