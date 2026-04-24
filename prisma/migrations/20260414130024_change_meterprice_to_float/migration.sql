/*
  Warnings:

  - You are about to alter the column `meterPrice` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "meterPrice" SET DATA TYPE BIGINT;
