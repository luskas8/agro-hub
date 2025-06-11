-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('cpf', 'cnpj');

-- CreateTable
CREATE TABLE "RuralProductor" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuralProductor_pkey" PRIMARY KEY ("id")
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
    "productorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RuralProductor_documentNumber_key" ON "RuralProductor"("documentNumber");

-- CreateIndex
CREATE INDEX "properties_state_idx" ON "properties"("state");

-- CreateIndex
CREATE INDEX "properties_productorId_idx" ON "properties"("productorId");

-- CreateIndex
CREATE UNIQUE INDEX "properties_productorId_name_key" ON "properties"("productorId", "name");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_productorId_fkey" FOREIGN KEY ("productorId") REFERENCES "RuralProductor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
