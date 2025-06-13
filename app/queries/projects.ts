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

export async function createProject(data: {
  name: string;
  description?: string;
  createdById: number;
}) {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      createdById: data.createdById,
      members: {
        create: {
          userId: data.createdById,
          role: "OWNER",
        },
      },
    },
  });
  return project;
}
