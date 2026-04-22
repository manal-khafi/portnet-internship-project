import { prisma } from "@/lib/prisma";

export async function loginUser(email: string, password: string) {
  // 1. Check if user exists in database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "User does not exist" };
  }

  // 2. If user exists, compare password (plain text as requested)
  if (user.password !== password) {
    return { error: "Invalid password" };
  }

  // 3. If correct, return user (WITHOUT password field)
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
}
