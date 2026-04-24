/*
  Warnings:

  - You are about to drop the column `formTitle` on the `ContactPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "ContactPage" DROP COLUMN "formTitle",
ADD COLUMN     "UnderTitle" TEXT;
