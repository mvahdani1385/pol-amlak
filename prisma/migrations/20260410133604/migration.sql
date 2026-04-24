-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "createYear" SET DATA TYPE BIGINT,
ALTER COLUMN "meterPrice" SET DATA TYPE BIGINT;
