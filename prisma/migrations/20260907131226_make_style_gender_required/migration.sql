/*
  Warnings:

  - Made the column `gender` on table `StyleTemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StyleTemplate" ALTER COLUMN "gender" SET NOT NULL;
