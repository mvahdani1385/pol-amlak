/*
  Warnings:

  - The `createYear` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `meterPrice` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "createYear",
ADD COLUMN     "createYear" INTEGER,
DROP COLUMN "meterPrice",
ADD COLUMN     "meterPrice" INTEGER;
