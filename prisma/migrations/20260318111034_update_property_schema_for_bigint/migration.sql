/*
  Warnings:

  - The `buildingArea` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `landArea` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "buildingArea",
ADD COLUMN     "buildingArea" BIGINT,
DROP COLUMN "landArea",
ADD COLUMN     "landArea" BIGINT;
