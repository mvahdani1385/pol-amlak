-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "meterPrice" SET DATA TYPE TEXT,
ALTER COLUMN "parkingnum" DROP NOT NULL;
