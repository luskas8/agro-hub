-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('cpf', 'cnpj');

-- CreateTable
CREATE TABLE "ruralProducer" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ruralProducer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "totalAreaInHectares" DOUBLE PRECISION NOT NULL,
    "vegetableAreaInHectares" DOUBLE PRECISION NOT NULL,
    "arableAreaInHectares" DOUBLE PRECISION NOT NULL,
    "producerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ruralProducer_documentNumber_key" ON "ruralProducer"("documentNumber");

-- CreateIndex
CREATE INDEX "farm_state_idx" ON "farm"("state");

-- CreateIndex
CREATE INDEX "farm_producerId_idx" ON "farm"("producerId");

-- CreateIndex
CREATE UNIQUE INDEX "farm_producerId_name_key" ON "farm"("producerId", "name");

-- CreateIndex
CREATE INDEX "crop_name_idx" ON "crop"("name");

-- AddForeignKey
ALTER TABLE "farm" ADD CONSTRAINT "farm_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "ruralProducer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crop" ADD CONSTRAINT "crop_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
