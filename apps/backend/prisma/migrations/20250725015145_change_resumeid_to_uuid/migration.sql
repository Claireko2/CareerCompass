/*
  Warnings:

  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Resume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `resumeId` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `resumeId` on the `ResumeSkill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "ResumeSkill" DROP CONSTRAINT "ResumeSkill_resumeId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "resumeId",
ADD COLUMN     "resumeId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Resume_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ResumeSkill" DROP COLUMN "resumeId",
ADD COLUMN     "resumeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "ResumeSkill" ADD CONSTRAINT "ResumeSkill_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
