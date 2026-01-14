-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "enable_auto_publish" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "provider_applications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_profile_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "cooldown_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_reviews" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT,
    "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_reviews_application_id_key" ON "application_reviews"("application_id");

-- AddForeignKey
ALTER TABLE "provider_applications" ADD CONSTRAINT "provider_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_applications" ADD CONSTRAINT "provider_applications_provider_profile_id_fkey" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_reviews" ADD CONSTRAINT "application_reviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "provider_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_reviews" ADD CONSTRAINT "application_reviews_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
