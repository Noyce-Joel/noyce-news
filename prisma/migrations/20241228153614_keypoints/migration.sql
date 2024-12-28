/*
  Warnings:

  - A unique constraint covering the columns `[articleId]` on the table `KeyPoints` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `articleId` to the `KeyPoints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KeyPoints" ADD COLUMN     "articleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "KeyPoints_articleId_key" ON "KeyPoints"("articleId");

-- AddForeignKey
ALTER TABLE "KeyPoints" ADD CONSTRAINT "KeyPoints_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
