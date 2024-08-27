/*
  Warnings:

  - The primary key for the `oAuth_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `provider` on the `oAuth_accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "oAuthProviders" AS ENUM ('GOOGLE', 'APPLE');

-- AlterTable
ALTER TABLE "oAuth_accounts" DROP CONSTRAINT "oAuth_accounts_pkey",
DROP COLUMN "provider",
ADD COLUMN     "provider" "oAuthProviders" NOT NULL,
ADD CONSTRAINT "oAuth_accounts_pkey" PRIMARY KEY ("provider", "providerUserId");

-- DropEnum
DROP TYPE "providers";
