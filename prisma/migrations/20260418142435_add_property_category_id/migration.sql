/*
  Warnings:

  - You are about to drop the column `category` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FilesCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
