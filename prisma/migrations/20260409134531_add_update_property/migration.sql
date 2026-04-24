/*
  Warnings:

  - Added the required column `parkingnum` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "createYear" TEXT,
ADD COLUMN     "meterPrice" BIGINT,
ADD COLUMN     "parkingnum" TEXT NOT NULL,
ADD COLUMN     "statusfile" TEXT;
