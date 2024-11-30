/*
  Warnings:

  - Made the column `hasAllergies` on table `patientHealthCare` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hasDiabetes` on table `patientHealthCare` required. This step will fail if there are existing NULL values in that column.
  - Made the column `smokingStatus` on table `patientHealthCare` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pregnancyStatus` on table `patientHealthCare` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hasPastSurgeries` on table `patientHealthCare` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recentAnxiety` on table `patientHealthCare` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recentDepression` on table `patientHealthCare` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "patientHealthCare" ALTER COLUMN "hasAllergies" SET NOT NULL,
ALTER COLUMN "hasDiabetes" SET NOT NULL,
ALTER COLUMN "smokingStatus" SET NOT NULL,
ALTER COLUMN "pregnancyStatus" SET NOT NULL,
ALTER COLUMN "hasPastSurgeries" SET NOT NULL,
ALTER COLUMN "recentAnxiety" SET NOT NULL,
ALTER COLUMN "recentDepression" SET NOT NULL;
