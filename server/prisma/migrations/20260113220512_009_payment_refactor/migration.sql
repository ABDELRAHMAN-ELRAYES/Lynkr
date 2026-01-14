/*
  Warnings:

  - You are about to drop the column `project_id` on the `payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_project_id_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "project_id";

-- CreateTable
CREATE TABLE "project_payments" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "project_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_payments_payment_id_key" ON "project_payments"("payment_id");

-- AddForeignKey
ALTER TABLE "project_payments" ADD CONSTRAINT "project_payments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_payments" ADD CONSTRAINT "project_payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
