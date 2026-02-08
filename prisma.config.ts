// This file configures Prisma for the Revzion CMS backend
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts", // ← Added seed command
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});