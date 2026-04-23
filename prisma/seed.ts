import {
  PrismaClient,
  UserRole,
  EtapeStatus,
  StatutGeographique,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ----------------------------
  // USERS
  // ----------------------------
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      nom: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "agent@example.com" },
    update: {},
    create: {
      nom: "Agent User",
      email: "agent@example.com",
      password: "123456",
      role: UserRole.AGENT,
    },
  });

  // ----------------------------
  // PORTS
  // ----------------------------
  const portsData = [
    {
      idPort: "TNG_MED",
      nom: "Tanger Med",
      bathymetrie: {
        profondeurMax: 18,
        profondeurMin: 10,
        tirantEauAutorise: 14,
        longueurQuai: 3000,
        postesDisponibles: 20,
        capacite: 11000000,
      },
    },
    {
      idPort: "CASA-01",
      nom: "Port de Casablanca",
      bathymetrie: {
        profondeurMax: 14,
        profondeurMin: 7,
        tirantEauAutorise: 12,
        longueurQuai: 2500,
        postesDisponibles: 18,
        capacite: 5000000,
      },
    },
    {
      idPort: "JORF",
      nom: "Jorf Lasfar",
      bathymetrie: {
        profondeurMax: 20,
        profondeurMin: 12,
        tirantEauAutorise: 16,
        longueurQuai: 2000,
        postesDisponibles: 12,
        capacite: 4000000,
      },
    },
  ];

  const createdPorts: Record<string, string> = {};

  for (const port of portsData) {
    const created = await prisma.port.upsert({
      where: { idPort: port.idPort },
      update: {},
      create: {
        idPort: port.idPort,
        nom: port.nom,
        bathymetrie: {
          create: port.bathymetrie,
        },
        meteo: {
          create: {
            meteo: 1.0,
            temperature: 22,
            vitesseVent: 12,
            visibilite: 10,
            hauteurHoule: 0.5,
            maree: "Moyenne",
            dateHeure: new Date(),
          },
        },
      },
    });

    createdPorts[port.idPort] = created.id;
  }

  // ----------------------------
  // AGENCES
  // ----------------------------
  const agence1 = await prisma.agence.upsert({
    where: { codeAgence: "AG-PORT-001" },
    update: {},
    create: {
      codeAgence: "AG-PORT-001",
      nomEntreprise: "Maroc Shipping Services",
    },
  });

  const agence2 = await prisma.agence.upsert({
    where: { codeAgence: "AG-PORT-002" },
    update: {},
    create: {
      codeAgence: "AG-PORT-002",
      nomEntreprise: "Global Marine Agency",
    },
  });

  // link agent to agence1
  await prisma.user.update({
    where: { email: "agent@example.com" },
    data: {
      agenceId: agence1.id,
    },
  });

  // ----------------------------
  // NAVIRES
  // ----------------------------
  const navire1 = await prisma.navire.create({
    data: {
      nom: "CMA CGM MARCO POLO",
      type: "Porte-conteneurs",
      longueur: 396,
      pavillon: "France",
      consignataire: "CMA CGM",
    },
  });

  const navire2 = await prisma.navire.create({
    data: {
      nom: "MAERSK ALABAMA",
      type: "Cargo",
      longueur: 300,
      pavillon: "USA",
      consignataire: "Maersk",
    },
  });

  const navire3 = await prisma.navire.create({
    data: {
      nom: "MSC OSCAR",
      type: "Porte-conteneurs",
      longueur: 395,
      pavillon: "Panama",
      consignataire: "MSC",
    },
  });

  // ----------------------------
  // ESCALES
  // ----------------------------

  // AGENT CAN SEE (agence1)
  await prisma.escale.create({
    data: {
      numeroEscale: 2026001,
      idPort: "CASA-01",
      eta: new Date(Date.now() + 86400000),
      statut: StatutGeographique.RADE,

      portId: createdPorts["CASA-01"],
      navireId: navire1.id,
      agenceId: agence1.id,

      avisArriveeStatus: EtapeStatus.DONE,
      dapStatus: EtapeStatus.DOING,
      activitesStatus: EtapeStatus.NOT_DONE,
      manifesteStatus: EtapeStatus.NOT_DONE,
      badStatus: EtapeStatus.NOT_DONE,
    },
  });

  await prisma.escale.create({
    data: {
      numeroEscale: 2026002,
      idPort: "TNG_MED",
      eta: new Date(Date.now() + 172800000),
      statut: StatutGeographique.AU_PORT,

      portId: createdPorts["TNG_MED"],
      navireId: navire2.id,
      agenceId: agence1.id,
    },
  });

  // AGENT CANNOT SEE (agence2)
  await prisma.escale.create({
    data: {
      numeroEscale: 2026003,
      idPort: "JORF",
      eta: new Date(Date.now() + 259200000),
      statut: StatutGeographique.A_QUAI,

      portId: createdPorts["JORF"],
      navireId: navire3.id,
      agenceId: agence2.id,
    },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });