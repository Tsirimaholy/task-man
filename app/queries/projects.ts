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

export async function updateProject(
  projectId: number,
  userId: number,
  data: {
    name?: string;
    description?: string;
  }
) {
  // First check if the user has permission to edit the project (owner or admin)
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId,
          role: {
            in: ["OWNER", "ADMIN"],
          },
        },
      },
    },
  });

  if (!project) {
    throw new Error(
      "Project not found or you don't have permission to edit it"
    );
  }

  // Update the project
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      updatedAt: new Date(),
    },
  });

  return updatedProject;
}

export async function deleteProject(projectId: number, userId: number) {
  // First check if the user is the owner of the project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  if (!project) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  // Delete the project (cascading deletes will handle related records)
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return project;
}
