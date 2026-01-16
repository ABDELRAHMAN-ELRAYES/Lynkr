-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password_changed_at" TIMESTAMP(3);
