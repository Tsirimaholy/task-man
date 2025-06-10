import type { User } from "generated/prisma";
import prisma from "~/lib/prisma";

export async function getMyProjects(userId: User["id"]) {
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
  return projects;
}
