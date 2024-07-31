-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enable2fa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFaSecret" TEXT;
