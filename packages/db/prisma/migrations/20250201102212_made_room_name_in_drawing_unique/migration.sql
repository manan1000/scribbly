/*
  Warnings:

  - A unique constraint covering the columns `[roomName]` on the table `Drawing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Drawing_roomName_key" ON "Drawing"("roomName");
