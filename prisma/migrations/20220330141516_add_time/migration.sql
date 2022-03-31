/*
  Warnings:

  - You are about to drop the column `refresh_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Wordjang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "refresh_token_expires_in";

-- AlterTable
ALTER TABLE "Wordjang" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
