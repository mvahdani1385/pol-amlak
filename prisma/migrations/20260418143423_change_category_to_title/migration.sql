/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Property` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_categoryId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "categoryId",
ADD COLUMN     "categoryTitle" TEXT;
