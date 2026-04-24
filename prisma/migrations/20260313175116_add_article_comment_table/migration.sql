/*
  Warnings:

  - Added the required column `articleId` to the `ArticleCommetn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticleCommetn" ADD COLUMN     "articleId" INTEGER NOT NULL;
