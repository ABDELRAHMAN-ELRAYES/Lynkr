-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "average_rating" DECIMAL(65,30),
ADD COLUMN     "total_reviews" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "target_user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "review_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_reviews" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "project_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_reviews" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "session_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_reviews_review_id_key" ON "project_reviews"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_reviews_review_id_project_id_key" ON "project_reviews"("review_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_reviews_review_id_key" ON "session_reviews"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_reviews_review_id_session_id_key" ON "session_reviews"("review_id", "session_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_reviews" ADD CONSTRAINT "project_reviews_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_reviews" ADD CONSTRAINT "project_reviews_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "teaching_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
