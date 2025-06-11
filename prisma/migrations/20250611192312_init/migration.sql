-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('cpf', 'cnpj');

-- CreateTable
CREATE TABLE "RuralProducer" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RuralProducer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
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

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crops" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RuralProducer_documentNumber_key" ON "RuralProducer"("documentNumber");

-- CreateIndex
CREATE INDEX "properties_state_idx" ON "properties"("state");

-- CreateIndex
CREATE INDEX "properties_producerId_idx" ON "properties"("producerId");

-- CreateIndex
CREATE UNIQUE INDEX "properties_producerId_name_key" ON "properties"("producerId", "name");

-- CreateIndex
CREATE INDEX "crops_name_idx" ON "crops"("name");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "RuralProducer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crops" ADD CONSTRAINT "crops_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
