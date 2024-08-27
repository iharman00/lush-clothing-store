/*
  Warnings:

  - The values [EMAIL] on the enum `accountType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `oAuth_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `providerId` on the `oAuth_accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "accountType_new" AS ENUM ('GOOGLE', 'APPLE');
ALTER TABLE "oAuth_accounts" ALTER COLUMN "providerId" TYPE "accountType_new" USING ("providerId"::text::"accountType_new");
ALTER TYPE "accountType" RENAME TO "accountType_old";
ALTER TYPE "accountType_new" RENAME TO "accountType";
DROP TYPE "accountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "oAuth_accounts" DROP CONSTRAINT "oAuth_accounts_pkey",
DROP COLUMN "providerId",
ADD COLUMN     "providerId" "accountType" NOT NULL,
ADD CONSTRAINT "oAuth_accounts_pkey" PRIMARY KEY ("providerId", "providerUser");
