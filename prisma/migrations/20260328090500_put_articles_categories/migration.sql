/*
  Warnings:

  - Added the required column `indexed` to the `ArticlesCategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticlesCategories" ADD COLUMN     "indexed" TEXT NOT NULL;
