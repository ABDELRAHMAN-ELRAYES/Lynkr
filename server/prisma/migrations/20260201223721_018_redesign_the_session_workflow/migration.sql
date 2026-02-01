-- DropForeignKey
ALTER TABLE "session_attendances" DROP CONSTRAINT "session_attendances_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_conversations" DROP CONSTRAINT "session_conversations_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_files" DROP CONSTRAINT "session_files_file_id_fkey";

-- DropForeignKey
ALTER TABLE "session_files" DROP CONSTRAINT "session_files_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_messages" DROP CONSTRAINT "session_messages_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "session_participants" DROP CONSTRAINT "session_participants_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_payments" DROP CONSTRAINT "session_payments_participant_id_fkey";

-- DropForeignKey
ALTER TABLE "session_payments" DROP CONSTRAINT "session_payments_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "session_reviews" DROP CONSTRAINT "session_reviews_review_id_fkey";

-- DropForeignKey
ALTER TABLE "session_reviews" DROP CONSTRAINT "session_reviews_session_id_fkey";

-- DropForeignKey
ALTER TABLE "teaching_sessions" DROP CONSTRAINT "teaching_sessions_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "teaching_slots" DROP CONSTRAINT "teaching_slots_provider_profile_id_fkey";

-- DropTable
DROP TABLE "session_attendances";

-- DropTable
DROP TABLE "session_conversations";

-- DropTable
DROP TABLE "session_files";

-- DropTable
DROP TABLE "session_messages";

-- DropTable
DROP TABLE "session_participants";

-- DropTable
DROP TABLE "session_payments";

-- DropTable
DROP TABLE "session_reviews";

-- DropTable
DROP TABLE "teaching_sessions";

-- DropTable
DROP TABLE "teaching_slots";

-- CreateTable
CREATE TABLE "provider_availabilities" (
    "id" TEXT NOT NULL,
    "provider_profile_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_requests" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "proposed_date" DATE NOT NULL,
    "proposed_time" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "is_custom_time" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meeting_id" TEXT,

    CONSTRAINT "meeting_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meeting_requests_meeting_id_key" ON "meeting_requests"("meeting_id");

-- AddForeignKey
ALTER TABLE "provider_availabilities" ADD CONSTRAINT "provider_availabilities_provider_profile_id_fkey" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_requests" ADD CONSTRAINT "meeting_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_requests" ADD CONSTRAINT "meeting_requests_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_requests" ADD CONSTRAINT "meeting_requests_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
