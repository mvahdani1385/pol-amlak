/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ArticlesCategories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticlesCategories_slug_key" ON "ArticlesCategories"("slug");
