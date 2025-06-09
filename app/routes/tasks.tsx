import * as reactRouter from "react-router";
import prisma from "~/lib/prisma";
import type { Route } from "./+types/tasks";
import TaskBoard from "~/components/task-board";
import type { TaskStatus } from "generated/prisma/enums";
import { Button } from "~/components/ui/button";
import {
  Calendar,
  PlusIcon,
  Settings2,
  SortDescIcon,
  SparklesIcon,
} from "lucide-react";
import { Paragraph } from "~/components/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const projectId = params.projectId ? parseInt(params.projectId) : 1;

  if (intent === "create") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;

    if (!title?.trim()) {
      return reactRouter.data({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: (status as any) || "TODO",
        priority: "MEDIUM",
        projectId: projectId,
      },
      include: {
        assignments: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subtasks: true,
        parent: true,
      },
    });

    return reactRouter.data({ task, success: true });
  }
  if (intent === "update") {
    // delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const taskId = parseInt(formData.get("taskId") as string);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!taskId) {
      return reactRouter.data(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title?.trim(),
        description: description?.trim() || null,
      },
      include: {
        assignments: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subtasks: true,
        parent: true,
      },
    });

    return reactRouter.data({ task, success: true });
  }
  if (intent === "update_status") {
    const taskId = parseInt(formData.get("taskId") as string);
    const status = formData.get("status") as TaskStatus;
    if (!taskId) {
      return reactRouter.data(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }
    if (!status.trim()) {
      return reactRouter.data({ error: "status is required" }, { status: 400 });
    }
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: status,
      },
      include: {
        assignments: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subtasks: true,
        parent: true,
      },
    });

    return reactRouter.data({ task, success: true });
  }

  return reactRouter.data({ error: "Invalid intent" }, { status: 400 });
}

export async function loader({ params }: Route.LoaderArgs) {
  const projectId = params.projectId ? parseInt(params.projectId) : 1; // Default to project 1 if no projectId in params
  const tasks = await prisma.task.findMany({
    where: {
      projectId: projectId,
    },
    include: {
      assignments: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      subtasks: true,
      parent: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const reviewTasks = tasks.filter((task) => task.status === "REVIEW");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return reactRouter.data({
    project,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    doneTasks,
  });
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const { project, todoTasks, inProgressTasks, reviewTasks, doneTasks } =
    loaderData;
  const fetcher = reactRouter.useFetcher();

  return (
    <div className="h-full flex flex-col overflow-scroll">
      {/* Action */}
      <nav className="mb-1 border-b py-2 flex justify-between">
        <div className="flex gap-2">
          <Button variant={"secondary"} className="text-xs" size={"sm"}>
            <Settings2 /> Filter
          </Button>
          <Button variant={"secondary"} size={"sm"} className="text-xs">
            <SortDescIcon /> Sort
          </Button>
          <Button variant={"secondary"} size={"sm"} className="text-xs">
            <SparklesIcon /> Automate
            <Paragraph
              as={"span"}
              className="text-sm bg-gradient-to-br from-blue-400 to-pink-600 bg-clip-text overflow-auto text-transparent font-bold"
            >
              Pro
            </Paragraph>
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="text-muted-foreground border px-1 rounded-sm flex items-center shadow-xs">
            <Calendar className="inline" size={15}></Calendar>
            <Paragraph
              className="inline ml-1 text-xs"
              textColorClassName="text-muted-foreground"
            >
              {project?.updatedAt &&
                new Date(project?.updatedAt).toLocaleDateString()}
            </Paragraph>
          </div>
          <Select>
            <SelectTrigger>
              Import/export
              <SelectContent>
                <SelectItem value="Import">Import</SelectItem>
                <SelectItem value="Export">Export</SelectItem>
              </SelectContent>
            </SelectTrigger>
          </Select>
          <Button size={"sm"} className="text-sm">
            <PlusIcon />
            Request task
          </Button>
        </div>
      </nav>
      {/* @ts-ignore */}
      {fetcher.data?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {/* @ts-ignore */}
          {fetcher.data?.error}
        </div>
      )}
      <div className="flex overflow-x-scroll gap-4 h-full py-1 items-start overflow-y-scroll pb-10">
        {/* To-do Column */}
        <TaskBoard
          status="TODO"
          tasks={todoTasks}
          title="To-do"
          isLoading={fetcher.state === "loading"}
        />
        {/* In Progress Column */}
        <TaskBoard
          status="IN_PROGRESS"
          tasks={inProgressTasks}
          title="In-Progress"
          isLoading={fetcher.state === "loading"}
        />
        {/* Review Column */}
        <TaskBoard
          tasks={reviewTasks}
          title="In-review"
          status="REVIEW"
          isLoading={fetcher.state === "loading"}
        />
        {/* Done Column */}
        <TaskBoard
          status="DONE"
          tasks={doneTasks}
          title="Done"
          isLoading={fetcher.state === "loading"}
        />
      </div>
    </div>
  );
}
