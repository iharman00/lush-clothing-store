/*
  Warnings:

  - The values [APPLE] on the enum `oAuthProviders` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "oAuthProviders_new" AS ENUM ('GOOGLE', 'GITHUB');
ALTER TABLE "oAuth_accounts" ALTER COLUMN "provider" TYPE "oAuthProviders_new" USING ("provider"::text::"oAuthProviders_new");
ALTER TYPE "oAuthProviders" RENAME TO "oAuthProviders_old";
ALTER TYPE "oAuthProviders_new" RENAME TO "oAuthProviders";
DROP TYPE "oAuthProviders_old";
COMMIT;
