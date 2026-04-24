/*
  Warnings:

  - You are about to drop the column `ContactPage` on the `DynamicOptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "DynamicOptions" DROP COLUMN "ContactPage";
