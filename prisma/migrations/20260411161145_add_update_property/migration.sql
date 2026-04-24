-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "seoCanonikalDestination" TEXT,
ADD COLUMN     "seoCanonikalOrigin" TEXT,
ADD COLUMN     "seoDestination" TEXT,
ADD COLUMN     "seoMeta" TEXT,
ADD COLUMN     "seoOrigin" TEXT,
ADD COLUMN     "seoRedirect" TEXT,
ADD COLUMN     "seoTitle" TEXT;
