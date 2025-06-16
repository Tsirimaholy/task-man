import type { TaskStatus } from "generated/prisma/enums";
import {
  Calendar,
  PlusIcon,
  Settings2,
  SortDescIcon,
  SparklesIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { data, useFetcher, useSubmit } from "react-router";
import { MultiSelect } from "~/components/multi-select";
import TaskBoard from "~/components/task/task-board";
import { Paragraph } from "~/components/typography";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { requireIsAuthenticated } from "~/lib/auth";
import prisma from "~/lib/prisma";
import type { Route } from "./+types/tasks";
import { ORDER } from "~/queries/tasks";
import type { Task } from "generated/prisma/client";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const projectId = params.projectId ? parseInt(params.projectId) : 1;

  if (intent === "create") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;

    if (!title?.trim()) {
      return data({ error: "Title is required" }, { status: 400 });
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

    return data({ task, success: true });
  }
  if (intent === "update") {
    const taskId = parseInt(formData.get("taskId") as string);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!taskId) {
      return data({ error: "Task ID is required" }, { status: 400 });
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

    return data({ task, success: true });
  }
  if (intent === "change_labels") {
    const taskId = parseInt(formData.get("taskId") as string);
    const labels = JSON.parse(
      formData.get("labelIds") as unknown as string
    ) as string[];
    const mappedLabels = labels.map((i) => parseInt(i));
    await prisma.labelOnTask.deleteMany({
      where: {
        taskId,
      },
    });
    await prisma.labelOnTask.createMany({
      data: mappedLabels.map((l) => ({
        labelId: l,
        taskId: taskId,
      })),
    });
    return;
  }
  if (intent === "update_status") {
    const taskId = parseInt(formData.get("taskId") as string);
    const status = formData.get("status") as TaskStatus;
    if (!taskId) {
      return data({ error: "Task ID is required" }, { status: 400 });
    }
    if (!status.trim()) {
      return data({ error: "status is required" }, { status: 400 });
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

    return data({ task, success: true });
  }

  return data(
    { error: "Invalid intent", message: `${intent} is an invalid intent` },
    { status: 400 }
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireIsAuthenticated(request);
  const searchParams = new URL(request.url).searchParams;
  const labels = await prisma.label.findMany();
  const labelsInParams = searchParams.getAll("labelsIn");
  const projectId = parseInt(params.projectId);

  let tasks: Task[] = [];
  const labelIds = labelsInParams
    .map((labelId) => {
      if (labelId) return parseInt(labelId);
    })
    .filter((labelId) => typeof labelId !== "undefined");

  if (searchParams.has("labelsIn") && labelIds.length > 0) {
    tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
        labels: {
          some: {
            labelId: {
              in: [...labelIds],
            },
          },
        },
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
        createdAt: "desc",
      },
    });
  } else {
    tasks = await prisma.task.findMany({
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
        createdAt: "desc",
      },
    });
    tasks = tasks.sort((a, b) => ORDER[a.priority] - ORDER[b.priority]);
  }
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

  return data({
    project,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    doneTasks,
    labels,
  });
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const {
    project,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    doneTasks,
    labels,
  } = loaderData;
  const fetcher = useFetcher();
  const [selectedLabels, setSelectedLabels] = useState<
    { label: string; value: string; color: string }[]
  >([]);
  const submit = useSubmit();
  const [popoverOpen, setPopOverOpen] = useState(false);
  return (
    <div className="h-full flex flex-col overflow-scroll">
      {/* Action */}
      <nav className="mb-1 border-b py-2 flex justify-between">
        <div className="flex gap-2">
          <Popover
            open={popoverOpen}
            onOpenChange={setPopOverOpen}
            modal={false}
          >
            <PopoverTrigger asChild>
              <Button variant={"secondary"} className="text-xs" size={"sm"}>
                <Settings2 /> Filter
                {selectedLabels.length > 0 && (
                  <Badge>{selectedLabels.length}</Badge>
                )}
                {selectedLabels.length > 0 && (
                  // reset label filter button
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // clear multi select
                      setSelectedLabels([]);
                      submit({});
                      setPopOverOpen(false);
                    }}
                  >
                    <X />
                  </button>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <MultiSelect
                onChange={(selected) => {
                  if (selected.length === 0) {
                    submit({});
                    return;
                  }
                  submit({
                    labelsIn: [selected.map((i) => i.value)],
                  });
                }}
                selected={selectedLabels}
                setSelected={setSelectedLabels}
                options={labels.map((label) => ({
                  label: label.name,
                  value: `${label.id}`,
                  color: label.color,
                }))}
              />
            </PopoverContent>
          </Popover>
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
