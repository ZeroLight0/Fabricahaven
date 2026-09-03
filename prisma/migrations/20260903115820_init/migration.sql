-- CreateEnum
CREATE TYPE "Occasion" AS ENUM ('CASUAL', 'OFFICIAL', 'TRADITIONAL', 'WEDDING', 'PARTY');

-- CreateEnum
CREATE TYPE "GarmentCategory" AS ENUM ('DRESS', 'TOP', 'TROUSERS', 'SKIRT', 'AGBADA', 'KAFTAN', 'SUIT', 'GOWN', 'JUMPSUIT', 'SHORTS', 'SET');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'FAILED');

-- CreateTable
CREATE TABLE "StyleTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "garment" "GarmentCategory" NOT NULL,
    "occasions" "Occasion"[],
    "yardageNotes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StyleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tailor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "specialtyTags" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tailor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "occasion" "Occasion" NOT NULL,
    "fabricImageUrl" TEXT NOT NULL,
    "fabricLabel" TEXT,
    "pricePerYard" DOUBLE PRECISION NOT NULL,
    "measurements" JSONB NOT NULL,
    "tailorId" TEXT,
    "chosenTemplateId" TEXT,
    "yardsNeeded" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleSelection" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "yardsNeeded" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StyleSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "paystackReference" TEXT NOT NULL,
    "paystackTxId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_submissionId_key" ON "Order"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paystackReference_key" ON "Order"("paystackReference");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_tailorId_fkey" FOREIGN KEY ("tailorId") REFERENCES "Tailor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_chosenTemplateId_fkey" FOREIGN KEY ("chosenTemplateId") REFERENCES "StyleTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleSelection" ADD CONSTRAINT "StyleSelection_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleSelection" ADD CONSTRAINT "StyleSelection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "StyleTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
