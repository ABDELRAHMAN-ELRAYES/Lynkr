/*
  Warnings:

  - You are about to drop the `provider_services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "provider_services" DROP CONSTRAINT "provider_services_provider_profile_id_fkey";

-- DropTable
DROP TABLE "provider_services";
