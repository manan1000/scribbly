/*
  Warnings:

  - A unique constraint covering the columns `[roomName]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomName` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_drawingId_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomName" TEXT NOT NULL,
ALTER COLUMN "drawingId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomName_key" ON "Room"("roomName");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_drawingId_fkey" FOREIGN KEY ("drawingId") REFERENCES "Drawing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
