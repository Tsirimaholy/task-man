import type { Project } from "generated/prisma";
import prisma from "~/lib/prisma";

export const ORDER = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};
export async function getTasks(projectId: Project["id"]) {
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
  });
  return tasks.sort((a, b) => {
    return ORDER[a.priority] - ORDER[b.priority];
  });
}
