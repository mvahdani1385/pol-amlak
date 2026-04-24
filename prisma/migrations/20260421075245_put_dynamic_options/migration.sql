-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "DynamicOptions" ADD COLUMN     "logo" TEXT DEFAULT 'logo.webp';
