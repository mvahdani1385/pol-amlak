-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- CreateTable
CREATE TABLE "DynamicOptions" (
    "id" SERIAL NOT NULL,
    "Province" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "DynamicOptions_pkey" PRIMARY KEY ("id")
);
