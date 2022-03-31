/*
  Warnings:

  - You are about to drop the `WordJang` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_wordjangId_fkey";

-- DropForeignKey
ALTER TABLE "WordJang" DROP CONSTRAINT "WordJang_userId_fkey";

-- DropTable
DROP TABLE "WordJang";

-- CreateTable
CREATE TABLE "Wordjang" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Wordjang_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wordjang" ADD CONSTRAINT "Wordjang_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_wordjangId_fkey" FOREIGN KEY ("wordjangId") REFERENCES "Wordjang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
