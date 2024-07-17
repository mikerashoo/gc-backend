import { PrismaClient } from "@prisma/client";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  db = global.prisma;
}


db.$use(
  createSoftDeleteMiddleware({
    models: {
      User: true,
      Provider: true, 
      Branch: true, 
    },
    defaultConfig: {
      field: "deletedAt",
      createValue: (deleted) => {
        if (deleted) return new Date();
        return null;
      },
    },
  
  })
);

export default db;
