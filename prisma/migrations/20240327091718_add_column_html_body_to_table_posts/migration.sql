/*
  Warnings:

  - Added the required column `HTMLBody` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `HTMLBody` LONGTEXT NOT NULL;
