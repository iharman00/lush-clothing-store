/*
  Warnings:

  - The primary key for the `oAuth_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `providerId` on the `oAuth_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerUser` on the `oAuth_accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `oAuth_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `oAuth_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerUserId` to the `oAuth_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "providers" AS ENUM ('GOOGLE', 'APPLE');

-- AlterTable
ALTER TABLE "oAuth_accounts" DROP CONSTRAINT "oAuth_accounts_pkey",
DROP COLUMN "providerId",
DROP COLUMN "providerUser",
ADD COLUMN     "provider" "providers" NOT NULL,
ADD COLUMN     "providerUserId" TEXT NOT NULL,
ADD CONSTRAINT "oAuth_accounts_pkey" PRIMARY KEY ("provider", "providerUserId");

-- DropEnum
DROP TYPE "accountType";

-- CreateIndex
CREATE UNIQUE INDEX "oAuth_accounts_userId_key" ON "oAuth_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_userId_key" ON "sessions"("userId");
