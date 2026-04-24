/*
  Warnings:

  - The `ContactPage` column on the `DynamicOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "DynamicOptions" DROP COLUMN "ContactPage",
ADD COLUMN     "ContactPage" JSONB;
