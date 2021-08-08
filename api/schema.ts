import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";

import { isAuthenticatedUser } from "./graphql/User";
import { shield } from "graphql-shield";

shield({
  Query: {
    me: isAuthenticatedUser,
  },
});

const schemas = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
    schema: join(__dirname, "..", "schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "./context.ts"),
    export: "Context",
  },
});

export const schema = schemas;
