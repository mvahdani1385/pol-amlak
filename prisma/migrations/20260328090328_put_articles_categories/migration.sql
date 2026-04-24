/*
  Warnings:

  - You are about to drop the column `seoCanonikal` on the `ArticlesCategories` table. All the data in the column will be lost.
  - Added the required column `seoCanonikalDestination` to the `ArticlesCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seoCanonikalOrigin` to the `ArticlesCategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticlesCategories" DROP COLUMN "seoCanonikal",
ADD COLUMN     "seoCanonikalDestination" TEXT NOT NULL,
ADD COLUMN     "seoCanonikalOrigin" TEXT NOT NULL;
