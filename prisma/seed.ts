import { PrismaClient, UserRole, EtapeStatus, StatutGeographique } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const casablancaPort = await prisma.port.upsert({
    where: { idPort: 'CASA-01' },
    update: {},
    create: {
      idPort: 'CASA-01',
      nom: 'Port de Casablanca',
      meteo: {
        create: {
          meteo: 1.2,
          temperature: 22.5,
          vitesseVent: 15.0,
          visibilite: 10.0,
          hauteurHoule: 0.5,
          maree: 'Haute',
          dateHeure: new Date(),
        },
      },
    },
  });

  const agence = await prisma.agence.upsert({
    where: { codeAgence: 'AG-PORT-001' },
    update: {},
    create: {
      codeAgence: 'AG-PORT-001',
      nomEntreprise: 'Maroc Shipping Services',
    },
  });

  await prisma.user.upsert({
    where: { email: 'manal@portnet.ma' },
    update: {},
    create: {
      nom: 'Manal',
      email: 'manal@portnet.ma',
      role: UserRole.ADMIN,
      portId: casablancaPort.id,
      agenceId: agence.id,
    },
  });

  const navire = await prisma.navire.create({
    data: {
      nom: 'CMA CGM MARCO POLO',
      type: 'Porte-conteneurs',
      longueur: 396.0,
      pavillon: 'France',
      consignataire: 'CMA CGM',
    },
  });

  await prisma.escale.create({
    data: {
      numeroEscale: 2026001,
      idPort: 'CASA-01',
      eta: new Date(Date.now() + 86400000), 
      statut: StatutGeographique.RADE,
      portId: casablancaPort.id,
      navireId: navire.id,
      agenceId: agence.id,
      avisArriveeStatus: EtapeStatus.DONE,    
      dapStatus: EtapeStatus.DOING,           
      activitesStatus: EtapeStatus.NOT_DONE,  
    },
  });

  console.log('✅ Database seeded successfully with PortNet data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });