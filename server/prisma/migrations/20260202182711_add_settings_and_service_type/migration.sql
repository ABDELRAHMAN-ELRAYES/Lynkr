-- AlterTable
ALTER TABLE "services" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PROJECT';

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "platform_name" TEXT NOT NULL DEFAULT 'Lynkr',
    "platform_commission" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "min_withdrawal" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
