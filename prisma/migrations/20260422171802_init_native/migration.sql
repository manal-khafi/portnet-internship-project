-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'AGENT');

-- CreateEnum
CREATE TYPE "StatutGeographique" AS ENUM ('RADE', 'AU_PORT', 'A_QUAI');

-- CreateEnum
CREATE TYPE "EtapeStatus" AS ENUM ('NOT_DONE', 'DOING', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "codeAgence" TEXT,
    "portId" INTEGER,
    "agenceId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Port" (
    "id" SERIAL NOT NULL,
    "idPort" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Port_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agence" (
    "id" SERIAL NOT NULL,
    "codeAgence" TEXT NOT NULL,
    "nomEntreprise" TEXT NOT NULL,

    CONSTRAINT "Agence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meteo" (
    "id" SERIAL NOT NULL,
    "meteo" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "vitesseVent" DOUBLE PRECISION NOT NULL,
    "visibilite" DOUBLE PRECISION NOT NULL,
    "hauteurHoule" DOUBLE PRECISION NOT NULL,
    "maree" TEXT NOT NULL,
    "dateHeure" TIMESTAMP(3) NOT NULL,
    "portId" INTEGER NOT NULL,

    CONSTRAINT "Meteo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bathymetrie" (
    "id" SERIAL NOT NULL,
    "profondeurMax" DOUBLE PRECISION NOT NULL,
    "profondeurMin" DOUBLE PRECISION NOT NULL,
    "tirantEauAutorise" DOUBLE PRECISION NOT NULL,
    "longueurQuai" DOUBLE PRECISION NOT NULL,
    "postesDisponibles" INTEGER NOT NULL,
    "capacite" INTEGER NOT NULL,
    "portId" INTEGER NOT NULL,

    CONSTRAINT "Bathymetrie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escale" (
    "id" SERIAL NOT NULL,
    "numeroEscale" INTEGER NOT NULL,
    "idPort" TEXT NOT NULL,
    "eta" TIMESTAMP(3) NOT NULL,
    "statut" "StatutGeographique" NOT NULL,
    "avisArriveeStatus" "EtapeStatus" NOT NULL DEFAULT 'NOT_DONE',
    "dapStatus" "EtapeStatus" NOT NULL DEFAULT 'NOT_DONE',
    "activitesStatus" "EtapeStatus" NOT NULL DEFAULT 'NOT_DONE',
    "manifesteStatus" "EtapeStatus" NOT NULL DEFAULT 'NOT_DONE',
    "badStatus" "EtapeStatus" NOT NULL DEFAULT 'NOT_DONE',
    "portId" INTEGER NOT NULL,
    "agenceId" INTEGER,
    "navireId" INTEGER NOT NULL,

    CONSTRAINT "Escale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Navire" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "longueur" DOUBLE PRECISION NOT NULL,
    "pavillon" TEXT NOT NULL,
    "consignataire" TEXT NOT NULL,

    CONSTRAINT "Navire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatistiquesFlotte" (
    "id" SERIAL NOT NULL,
    "nbEnRade" INTEGER NOT NULL,
    "nbAuPort" INTEGER NOT NULL,
    "nbAQuai" INTEGER NOT NULL,
    "totalSousGestion" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StatistiquesFlotte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Port_idPort_key" ON "Port"("idPort");

-- CreateIndex
CREATE UNIQUE INDEX "Agence_codeAgence_key" ON "Agence"("codeAgence");

-- CreateIndex
CREATE UNIQUE INDEX "Meteo_portId_key" ON "Meteo"("portId");

-- CreateIndex
CREATE UNIQUE INDEX "Bathymetrie_portId_key" ON "Bathymetrie"("portId");

-- CreateIndex
CREATE UNIQUE INDEX "Escale_numeroEscale_key" ON "Escale"("numeroEscale");

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
