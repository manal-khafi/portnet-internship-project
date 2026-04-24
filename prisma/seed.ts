import {
  PrismaClient,
  UserRole,
  EtapeStatus,
  StatutGeographique,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  // Order matters due to foreign key constraints
  await prisma.statistiquesFlotte.deleteMany();
  await prisma.escale.deleteMany();
  await prisma.navire.deleteMany();
  await prisma.user.deleteMany();
  await prisma.meteo.deleteMany();
  await prisma.bathymetrie.deleteMany();
  await prisma.port.deleteMany();
  await prisma.agence.deleteMany();

  // ----------------------------
  // 1. AGENCIES
  // ----------------------------
  const agences = await Promise.all([
    prisma.agence.create({
      data: { codeAgence: "AG-MAR-01", nomEntreprise: "Maroc Shipping Services" },
    }),
    prisma.agence.create({
      data: { codeAgence: "AG-GLO-02", nomEntreprise: "Global Marine Agency" },
    }),
    prisma.agence.create({
      data: { codeAgence: "AG-MED-03", nomEntreprise: "Mediterranean Logistics" },
    }),
  ]);

  // ----------------------------
  // 2. PORTS & BATHYMETRY
  // ----------------------------
  const portsData = [
    { idPort: "TNG_MED", nom: "Tanger Med", lat: 35.89, lon: -5.50 },
    { idPort: "CASA-01", nom: "Port de Casablanca", lat: 33.60, lon: -7.60 },
    { idPort: "JORF", nom: "Jorf Lasfar", lat: 33.12, lon: -8.63 },
    { idPort: "AGADIR", nom: "Port d'Agadir", lat: 30.42, lon: -9.63 },
    { idPort: "NADOR", nom: "Port de Nador", lat: 35.28, lon: -2.93 },
  ];

  const createdPorts = [];
  for (const p of portsData) {
    const port = await prisma.port.create({
      data: {
        ...p,
        bathymetrie: {
          create: {
            profondeurMax: 18,
            profondeurMin: 10,
            tirantEauAutorise: 14,
            longueurQuai: 2000,
            postesDisponibles: 10,
            capacite: 5000000,
          },
        },
        meteo: {
          create: {
            meteo: 1.0,
            temperature: 20,
            vitesseVent: 15,
            visibilite: 12,
            hauteurHoule: 0.8,
            maree: "Haute",
            dateHeure: new Date(),
          },
        },
      },
    });
    createdPorts.push(port);
  }

  // ----------------------------
  // 3. USERS (Admin + Multiple Agents)
  // ----------------------------
  await prisma.user.createMany({
    data: [
      {
        nom: "Super Admin",
        email: "admin@port.ma",
        password: "adminpassword",
        role: UserRole.ADMIN,
      },
      {
        nom: "Admin Secondary",
        email: "admin2@port.ma",
        password: "adminpassword",
        role: UserRole.ADMIN,
      },
      {
        nom: "Agent Casablanca",
        email: "agent.casa@agency.ma",
        password: "password123",
        role: UserRole.AGENT,
        agenceId: agences[0].id,
      },
      {
        nom: "Agent Tanger",
        email: "agent.tanger@agency.ma",
        password: "password123",
        role: UserRole.AGENT,
        agenceId: agences[1].id,
      },
      {
        nom: "Agent Nador",
        email: "agent.nador@agency.ma",
        password: "password123",
        role: UserRole.AGENT,
        agenceId: agences[2].id,
      },
    ],
  });

  // ----------------------------
  // 4. NAVIRES (Ships)
  // ----------------------------
  const navires = await Promise.all([
    prisma.navire.create({ data: { nom: "CMA CGM MARCO POLO", type: "Container", longueur: 396, pavillon: "France", consignataire: "CMA CGM" } }),
    prisma.navire.create({ data: { nom: "MAERSK ALABAMA", type: "Cargo", longueur: 155, pavillon: "USA", consignataire: "Maersk" } }),
    prisma.navire.create({ data: { nom: "MSC OSCAR", type: "Container", longueur: 395, pavillon: "Panama", consignataire: "MSC" } }),
    prisma.navire.create({ data: { nom: "EVER GIVEN", type: "Container", longueur: 400, pavillon: "Taiwan", consignataire: "Evergreen" } }),
    prisma.navire.create({ data: { nom: "OCEAN GIANT", type: "Bulker", longueur: 220, pavillon: "Liberia", consignataire: "Global Ocean" } }),
    prisma.navire.create({ data: { nom: "GASLOG SAVANNAH", type: "LNG Carrier", longueur: 285, pavillon: "Bermuda", consignataire: "GasLog" } }),
  ]);

  // ----------------------------
  // 5. ESCALES (The Dashboard Data)
  // ----------------------------
  const escalesData = [
    {
      numeroEscale: 1001,
      idPort: "CASA-01",
      statut: StatutGeographique.RADE,
      navireIdx: 0,
      agenceIdx: 0,
      steps: { avisArriveeStatus: EtapeStatus.DONE, dapStatus: EtapeStatus.DOING }
    },
    {
      numeroEscale: 1002,
      idPort: "TNG_MED",
      statut: StatutGeographique.AU_PORT,
      navireIdx: 1,
      agenceIdx: 1,
      steps: { avisArriveeStatus: EtapeStatus.DONE, dapStatus: EtapeStatus.DONE, activitesStatus: EtapeStatus.DOING }
    },
    {
      numeroEscale: 1003,
      idPort: "JORF",
      statut: StatutGeographique.A_QUAI,
      navireIdx: 2,
      agenceIdx: 2,
      steps: { avisArriveeStatus: EtapeStatus.DONE, dapStatus: EtapeStatus.DONE, activitesStatus: EtapeStatus.DONE, manifesteStatus: EtapeStatus.DOING }
    },
    {
      numeroEscale: 1004,
      idPort: "AGADIR",
      statut: StatutGeographique.RADE,
      navireIdx: 3,
      agenceIdx: 0,
      steps: { avisArriveeStatus: EtapeStatus.NOT_DONE }
    },
    {
      numeroEscale: 1005,
      idPort: "NADOR",
      statut: StatutGeographique.A_QUAI,
      navireIdx: 4,
      agenceIdx: 1,
      steps: { avisArriveeStatus: EtapeStatus.DONE, dapStatus: EtapeStatus.DONE, activitesStatus: EtapeStatus.DONE, manifesteStatus: EtapeStatus.DONE, badStatus: EtapeStatus.DONE }
    },
  ];

  for (const e of escalesData) {
    const port = createdPorts.find(p => p.idPort === e.idPort);
    await prisma.escale.create({
      data: {
        numeroEscale: e.numeroEscale,
        idPort: e.idPort,
        eta: new Date(Date.now() + Math.random() * 1000000000),
        statut: e.statut,
        portId: port!.id,
        navireId: navires[e.navireIdx].id,
        agenceId: agences[e.agenceIdx].id,
        ...e.steps
      },
    });
  }

  console.log("✅ Database seeded with extensive data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });