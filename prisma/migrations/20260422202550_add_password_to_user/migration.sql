/*
  Warnings:

  - The primary key for the `Agence` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Bathymetrie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Escale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Meteo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Navire` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Port` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StatistiquesFlotte` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bathymetrie" DROP CONSTRAINT "Bathymetrie_portId_fkey";

-- DropForeignKey
ALTER TABLE "Escale" DROP CONSTRAINT "Escale_agenceId_fkey";

-- DropForeignKey
ALTER TABLE "Escale" DROP CONSTRAINT "Escale_navireId_fkey";

-- DropForeignKey
ALTER TABLE "Escale" DROP CONSTRAINT "Escale_portId_fkey";

-- DropForeignKey
ALTER TABLE "Meteo" DROP CONSTRAINT "Meteo_portId_fkey";

-- DropForeignKey
ALTER TABLE "StatistiquesFlotte" DROP CONSTRAINT "StatistiquesFlotte_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_agenceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_portId_fkey";

-- AlterTable
ALTER TABLE "Agence" DROP CONSTRAINT "Agence_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Agence_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Agence_id_seq";

-- AlterTable
ALTER TABLE "Bathymetrie" DROP CONSTRAINT "Bathymetrie_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "portId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bathymetrie_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bathymetrie_id_seq";

-- AlterTable
ALTER TABLE "Escale" DROP CONSTRAINT "Escale_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "portId" SET DATA TYPE TEXT,
ALTER COLUMN "agenceId" SET DATA TYPE TEXT,
ALTER COLUMN "navireId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Escale_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Escale_id_seq";

-- AlterTable
ALTER TABLE "Meteo" DROP CONSTRAINT "Meteo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "portId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Meteo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Meteo_id_seq";

-- AlterTable
ALTER TABLE "Navire" DROP CONSTRAINT "Navire_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Navire_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Navire_id_seq";

-- AlterTable
ALTER TABLE "Port" DROP CONSTRAINT "Port_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Port_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Port_id_seq";

-- AlterTable
ALTER TABLE "StatistiquesFlotte" DROP CONSTRAINT "StatistiquesFlotte_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StatistiquesFlotte_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StatistiquesFlotte_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "portId" SET DATA TYPE TEXT,
ALTER COLUMN "agenceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_portId_fkey" FOREIGN KEY ("portId") REFERENCES "Port"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "Agence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meteo" ADD CONSTRAINT "Meteo_portId_fkey" FOREIGN KEY ("portId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bathymetrie" ADD CONSTRAINT "Bathymetrie_portId_fkey" FOREIGN KEY ("portId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escale" ADD CONSTRAINT "Escale_portId_fkey" FOREIGN KEY ("portId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escale" ADD CONSTRAINT "Escale_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "Agence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escale" ADD CONSTRAINT "Escale_navireId_fkey" FOREIGN KEY ("navireId") REFERENCES "Navire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatistiquesFlotte" ADD CONSTRAINT "StatistiquesFlotte_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
