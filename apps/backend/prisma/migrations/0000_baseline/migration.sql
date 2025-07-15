-- CreateTable
CREATE TABLE "esco_skills" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "alt_labels" JSONB,
    "skill_type" TEXT,
    "status" TEXT,
    "modified_at" TIMESTAMP(6),
    "description" TEXT,

    CONSTRAINT "esco_skills_pkey" PRIMARY KEY ("id")
);

