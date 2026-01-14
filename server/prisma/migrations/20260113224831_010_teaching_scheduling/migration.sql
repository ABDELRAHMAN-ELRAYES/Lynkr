-- CreateTable
CREATE TABLE "teaching_slots" (
    "id" TEXT NOT NULL,
    "provider_profile_id" TEXT NOT NULL,
    "slot_date" DATE NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "session_type" TEXT NOT NULL,
    "max_participants" INTEGER NOT NULL DEFAULT 1,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teaching_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teaching_sessions" (
    "id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "channel_name" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teaching_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_participants" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BOOKED',
    "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_payments" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,

    CONSTRAINT "session_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_attendances" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),

    CONSTRAINT "session_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_files" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "uploader_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_conversations" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teaching_sessions_slot_id_key" ON "teaching_sessions"("slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "teaching_sessions_channel_name_key" ON "teaching_sessions"("channel_name");

-- CreateIndex
CREATE UNIQUE INDEX "session_participants_session_id_user_id_key" ON "session_participants"("session_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_payments_payment_id_key" ON "session_payments"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_payments_participant_id_key" ON "session_payments"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_conversations_session_id_key" ON "session_conversations"("session_id");

-- AddForeignKey
ALTER TABLE "teaching_slots" ADD CONSTRAINT "teaching_slots_provider_profile_id_fkey" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_sessions" ADD CONSTRAINT "teaching_sessions_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "teaching_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "teaching_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_payments" ADD CONSTRAINT "session_payments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_payments" ADD CONSTRAINT "session_payments_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "session_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_attendances" ADD CONSTRAINT "session_attendances_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "teaching_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_files" ADD CONSTRAINT "session_files_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "teaching_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_files" ADD CONSTRAINT "session_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_conversations" ADD CONSTRAINT "session_conversations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "teaching_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_messages" ADD CONSTRAINT "session_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "session_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
