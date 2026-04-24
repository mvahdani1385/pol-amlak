-- CreateTable
CREATE TABLE "ArticleCommetn" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "user" TEXT[],
    "comment" TEXT NOT NULL,
    "replay" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleCommetn_pkey" PRIMARY KEY ("id")
);
