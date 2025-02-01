/*
  Warnings:

  - You are about to drop the column `drawingId` on the `Room` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `Drawing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_drawingId_fkey";

-- DropIndex
DROP INDEX "Room_drawingId_key";

-- AlterTable
ALTER TABLE "Drawing" ADD COLUMN     "roomName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "drawingId";
