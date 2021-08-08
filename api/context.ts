import { db } from "./db";
import { PrismaClient } from "@prisma/client";

export interface Context {
  db: PrismaClient;
  req: any;
}

export function createContext(req: any) {
  return {
    ...req,
    db,
  };
}
