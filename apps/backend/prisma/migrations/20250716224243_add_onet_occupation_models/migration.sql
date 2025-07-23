-- CreateTable
CREATE TABLE "Occupation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL,

    CONSTRAINT "Occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OccupationSkill" (
    "occupationId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "relationType" TEXT,
    "skillType" TEXT,

    CONSTRAINT "OccupationSkill_pkey" PRIMARY KEY ("occupationId","skillId")
);

-- AddForeignKey
ALTER TABLE "OccupationSkill" ADD CONSTRAINT "OccupationSkill_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "Occupation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupationSkill" ADD CONSTRAINT "OccupationSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "esco_skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
