-- CreateTable
CREATE TABLE "ArticlesCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "seoMeta" TEXT NOT NULL,
    "seoCanonikal" TEXT NOT NULL,
    "seoOrigin" TEXT NOT NULL,
    "seoDestination" TEXT NOT NULL,
    "seoRedirect" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticlesCategories_pkey" PRIMARY KEY ("id")
);
