-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "redirect" TEXT NOT NULL DEFAULT '';
