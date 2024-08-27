-- CreateEnum
CREATE TYPE "accountType" AS ENUM ('EMAIL', 'GOOGLE', 'APPLE');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;
