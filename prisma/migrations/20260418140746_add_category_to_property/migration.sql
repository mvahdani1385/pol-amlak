-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "categoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FilesCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
