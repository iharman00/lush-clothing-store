/*
  Warnings:

  - You are about to drop the `oAuth_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "oAuth_accounts" DROP CONSTRAINT "oAuth_accounts_userId_fkey";

-- DropTable
DROP TABLE "oAuth_accounts";

-- DropEnum
DROP TYPE "oAuthProviders";
