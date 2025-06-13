/*
  Warnings:

  - You are about to drop the `crop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "crop" DROP CONSTRAINT "crop_farmId_fkey";

-- DropTable
DROP TABLE "crop";

-- CreateTable
CREATE TABLE "harvest" (
    "id" TEXT NOT NULL,
    "harverstYear" INTEGER NOT NULL,
    "farmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "harvest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultivation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "harvestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultivation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "harvest_farmId_idx" ON "harvest"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "harvest_farmId_harverstYear_key" ON "harvest"("farmId", "harverstYear");

-- CreateIndex
CREATE INDEX "cultivation_name_idx" ON "cultivation"("name");

-- AddForeignKey
ALTER TABLE "harvest" ADD CONSTRAINT "harvest_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultivation" ADD CONSTRAINT "cultivation_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "harvest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
