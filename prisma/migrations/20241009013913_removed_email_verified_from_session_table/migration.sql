/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "emailVerified";
