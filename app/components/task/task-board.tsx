import type { Task, TaskStatus } from "generated/prisma/client";
import { LucidePlus, MoreHorizontal, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useSubmit } from "react-router";
import BoardStatusIcon from "./board-status-icon";
import EmptyTaskCard from "./empty-task-card";
import TaskCard from "./task-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export type TAssignee = {
  id: number;
  name: string | null;
  email: string;
};

export interface ITask {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: number;
  parentId: number | null;
  assignments: { assignee: TAssignee }[];
  labels: {
    label: {
      id: number;
      name: string;
      color: string;
    };
  }[];
  comments: {
    author: {
      id: number;
      name: string | null;
      email: string;
    };
  }[];
  subtasks: any[];
  parent: any;
}
type TaskBoardProps = {
  title: string;
  tasks: ITask[];
  onTaskAction?: (taskData: any, intent: string) => void;
  isLoading?: boolean;
  status: TaskStatus;
};

export default function TaskBoard({
  tasks,
  title,
  status,
  onTaskAction,
  isLoading = false,
}: TaskBoardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [acceptDrop, setAcceptDrop] = useState(false);
  const submit = useSubmit();

  const validateFields = (title: string) => {
    if (!title.trim()) {
      return; // Don't save tasks without titles
    }
    setIsCreating(false);
  };

  const handleCancelNewTask = () => {
    setIsCreating(false);
  };

  const showTaskCreationForm = () => {
    if (!isCreating && !isLoading) {
      setIsCreating(true);
    }
  };
  function handleDropAccept(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const task: Task = JSON.parse(
      e.dataTransfer.getData("application/json")
    ) as Task;
    // Do not submit if it is dropped on the same board as prev board
    if (task.status !== status) {
      updateTaskStatus(task.id.toString(), status);
    }
    setAcceptDrop(false);
  }

  function updateTaskStatus(taskId: string, new_status: string) {
    const INTENT = "update_status";
    const formData = new FormData();
    formData.append("taskId", taskId.toString());
    formData.append("intent", INTENT);
    formData.append("status", new_status);
    submit(formData, { method: "PATCH" });
  }

  return (
    // board main container
    <div
      id={status}
      className={`min-w-80 max-w-96 p-1 bg-gray-200 rounded-lg flex flex-col max-h-full pb-2 scroll-smooth ${
        acceptDrop && !tasks.length
          ? "outline-2 rounded-b-sm transition-all outline-dashed"
          : ""
      } `}
      onDragOver={(e) => {
        e.preventDefault();
        setAcceptDrop(true);
      }}
      onDrop={handleDropAccept}
      onDragLeave={(e) => {
        e.preventDefault();
        setAcceptDrop(false);
      }}
      onDragEnd={(e) => {
        e.preventDefault();
        setAcceptDrop(false);
      }}
    >
      {/* Board header */}
      <div className="flex justify-between">
        <div className={`flex items-center text-muted-foreground`}>
          <BoardStatusIcon size={20} status={status}></BoardStatusIcon>
          <h1 className="text-lg mx-1">{title} </h1>
          <Badge className="rounded-full">{tasks.length}</Badge>
        </div>
        <div className="text-muted-foreground">
          <div
            className={`inline-block cursor-pointer transition-colors duration-150 hover:text-blue-500 ${
              isCreating || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={showTaskCreationForm}
            title="Add new task"
          >
            <LucidePlus size={20} />
          </div>
          <div
            className="inline-block ml-2 cursor-pointer hover:text-gray-700 transition-colors duration-150"
            title="More options"
          >
            <MoreHorizontal size={20} />
          </div>
        </div>
      </div>
      {/* tasks list container */}
      <div
        className={`flex-1 overflow-auto bg-gray-100 rounded-sm relative${
          acceptDrop
            ? "outline-2 rounded-b-sm transition-all outline-dashed"
            : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setAcceptDrop(true);
        }}
        onDrop={handleDropAccept}
        onDragLeave={() => {
          setAcceptDrop(false);
        }}
        onDragEnd={() => {
          setAcceptDrop(false);
        }}
      >
        {" "}
        {/* {tasks.length == 0 && !isCreating && !acceptDrop && (
          <Paragraph className="absolute top-1/2 left-1/2 translate-[-50%]">
            No {title} tasks yet
          </Paragraph>
        )} */}
        {isCreating && (
          <EmptyTaskCard
            status={status}
            onSave={validateFields}
            onCancel={handleCancelNewTask}
          />
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSave={(updatedTask) => {
              if (onTaskAction) {
                onTaskAction(updatedTask, "update");
              }
            }}
          />
        ))}
      </div>
      <div className="px-2 pt-3 flex items-center">
        <Button
          variant={"ghost"}
          onClick={showTaskCreationForm}
          className="w-full justify-start cursor-pointer"
        >
          <PlusIcon
            className="cursor-pointer hover:text-blue-500 transition-all"
            size={20}
          />
          Add Task
        </Button>
      </div>
    </div>
  );
}
