import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";

export async function getEscalesForUser(user: { role: string; agenceId: string | null }) {
  // ADMIN can see everything
  if (user.role === UserRole.ADMIN) {
    console.log(`[DATA-ACCESS] ADMIN access: fetching all escales`);
    return prisma.escale.findMany({
      include: {
        navire: true,
      },
    });
  }

  // AGENT is restricted to their agency
  if (user.role === UserRole.AGENT) {
    if (!user.agenceId) {
      console.warn(`[DATA-ACCESS] AGENT ${user.role} has no agenceId assigned`);
      return [];
    }
    console.log(`[DATA-ACCESS] AGENT access: filtering by agenceId: ${user.agenceId}`);
    return prisma.escale.findMany({
      where: {
        agenceId: user.agenceId,
      },
      include: {
        navire: true,
      },
    });
  }

  return [];
}

export async function getNavireByIdForUser(user: { role: string; agenceId: string | null }, navireId: string) {
  // ADMIN can see any navire
  if (user.role === UserRole.ADMIN) {
    return prisma.navire.findUnique({
      where: { id: navireId },
      include: {
        escales: {
          orderBy: { eta: 'desc' },
          take: 1,
          include: { port: true }
        }
      }
    });
  }

  // AGENT can only see navire if they have an escale linked to it for their agency
  if (user.role === UserRole.AGENT) {
    if (!user.agenceId) return null;

    return prisma.navire.findFirst({
      where: {
        id: navireId,
        escales: {
          some: {
            agenceId: user.agenceId
          }
        }
      },
      include: {
        escales: {
          where: {
            agenceId: user.agenceId
          },
          orderBy: { eta: 'desc' },
          take: 1,
          include: { port: true }
        }
      }
    });
  }

  return null;
}
