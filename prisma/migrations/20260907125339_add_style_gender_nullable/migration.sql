-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "StyleTemplate" ADD COLUMN     "gender" "Gender";
