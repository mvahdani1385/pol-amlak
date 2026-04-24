-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "seoCanonikalDestination" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoCanonikalOrigin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoDestination" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoMeta" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoOrigin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoRedirect" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoTitle" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "redirect" SET DEFAULT '';
