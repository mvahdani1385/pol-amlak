/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `FilesCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `FilesCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "FilesCategory" ADD COLUMN     "indexed" TEXT NOT NULL DEFAULT 'false',
ADD COLUMN     "seoCanonikalDestination" TEXT,
ADD COLUMN     "seoCanonikalOrigin" TEXT,
ADD COLUMN     "seoDestination" TEXT,
ADD COLUMN     "seoMeta" TEXT,
ADD COLUMN     "seoOrigin" TEXT,
ADD COLUMN     "seoRedirect" TEXT NOT NULL DEFAULT '301',
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FilesCategory_slug_key" ON "FilesCategory"("slug");
