import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const dbAdapter = new PrismaAdapter(client.session, client.user);

export default dbAdapter;
