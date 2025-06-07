import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  File,
  Link,
  MessageCircle,
} from "lucide-react";

import { Paragraph } from "~/components/typography";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import type { ITask, TAssignee } from "./task-board";
import BoardStatusIcon from "./board-status-icon";
import { useFetcher } from "react-router";
import { getInitial } from "~/lib/core_utils";

interface TaskCardProps {
  task: ITask;
  onSave?: (task: Partial<ITask>) => void | Promise<void>;
}

export default function TaskCard({ task }: TaskCardProps) {
  const updateTaskFormFetcher = useFetcher();
  const isSaving = updateTaskFormFetcher.state === "submitting";
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingDescription && textareaRef.current) {
      adjustTextareaHeight();
      textareaRef.current.focus();
    }
  }, [isEditingDescription]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const updateTask = (taskData: ITask) => {
    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("taskId", taskData.id.toString());
    formData.append("title", taskData.title);
    formData.append("description", taskData.description || "");

    updateTaskFormFetcher.submit(formData, { method: "post" });
  };

  const handleTitleSave = () => {
    if (title.trim()) {
      try {
        updateTask({ ...task, title: title.trim() });
        setIsEditingTitle(false);
      } catch (error) {
        console.error("Failed to save title:", error);
      }
    } else {
      setTitle(task.title || "");
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionSave = () => {
    try {
      updateTask({ ...task, description: description.trim() });
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to save description:", error);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === "Escape") {
      setTitle(task.title || "");
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleDescriptionSave();
    } else if (e.key === "Escape") {
      setDescription(task.description || "");
      setIsEditingDescription(false);
    }
  };

  return (
    <div className="mt-2 max-w-full transition-all duration-200 px-1">
      <Card
        className={`p-2 gap-0 ${isSaving ? "opacity-95" : ""}`}
        id={task.id.toString()}
        draggable={!isEditingTitle && !isEditingDescription}
        onDragStart={(e) => {
          e.dataTransfer.setData("application/json", JSON.stringify(task));
        }}
      >
        <CardTitle className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="inline-block bg-accent p-1 rounded-sm shrink-0">
              <BoardStatusIcon status={task.status} />
            </div>
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="inline-block align-text-top ml-2 h-auto shadow-none p-0 text-base font-semibold bg-transparent focus:bg-white focus:border focus:border-blue-300 rounded-sm border-none"
                placeholder="Enter task title..."
                disabled={isSaving}
              />
            ) : (
              <div className="ml-2 overflow-hidden pb-1">
                <p
                  className="cursor-text hover:bg-accent hover:bg-opacity-70 px-1 rounded transition-colors duration-150 wrap-break-word"
                  onClick={() => setIsEditingTitle(true)}
                  title="Click to edit title"
                >
                  {title || task.title || "Click to add title..."}
                </p>
              </div>
            )}
          </div>
          {task.status === "DONE" && (
            <CheckCircle2 className="text-green-500" size={20} />
          )}
        </CardTitle>
        <CardDescription className="">
          {isEditingDescription ? (
            <Textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                adjustTextareaHeight();
              }}
              onBlur={handleDescriptionSave}
              onKeyDown={handleDescriptionKeyDown}
              className="text-sm border-none shadow-none p-1 resize-none min-h-[20px] bg-transparent focus:bg-white focus:border focus:border-blue-300 rounded-sm overflow-hidden"
              placeholder="Add a description... (Ctrl+Enter to save, Esc to cancel)"
              disabled={isSaving}
              rows={1}
            />
          ) : (
            <div
              className="text-sm cursor-text hover:bg-accent hover:bg-opacity-70 px-1 rounded transition-colors duration-150 min-h-[20px] flex items-center w-full"
              onClick={() => setIsEditingDescription(true)}
              title="Click to edit description"
            >
              <Paragraph
                className="wrap-break-word text-sm whitespace-pre-line"
                textColorClassName="text-muted-forground"
              >
                {description ||
                  task.description ||
                  "Click to add description..."}
              </Paragraph>
            </div>
          )}
          <div className="flex gap-1 mt-2">
            {task.labels.map((labelOnTask) => (
              <Badge
                key={labelOnTask.label.id}
                className="text-blue-400 bg-blue-100 text-xs"
                style={{
                  backgroundColor: labelOnTask.label.color + "20",
                  color: labelOnTask.label.color,
                }}
              >
                {labelOnTask.label.name}
              </Badge>
            ))}
          </div>
        </CardDescription>
        <Separator className="border-[0.5px] border-dashed bg-[none] my-3.5" />
        <CardFooter className="gap-2 items-start px-0 justify-between">
          <div className="flex gap-2">
            <div className="text-muted-foreground border px-1 rounded-sm">
              <Calendar className="inline" size={15}></Calendar>
              <Paragraph
                className="inline ml-1 text-xs"
                textColorClassName="text-muted-foreground"
              >
                {new Date(task.createdAt).toLocaleDateString()}
              </Paragraph>
            </div>
            <div className="text-muted-foreground border px-1 rounded-sm">
              <File className="inline " size={15}></File>
              <Paragraph className="inline align-middle ml-1 text-xs">
                0
              </Paragraph>
            </div>
            {task.comments.length !== 0 && (
              <div className="text-muted-foreground border px-1 rounded-sm">
                <MessageCircle className="inline " size={15}></MessageCircle>
                <Paragraph className="inline align-middle ml-1 text-xs">
                  {task.comments.length}
                </Paragraph>
              </div>
            )}
            <div className="text-muted-foreground border px-1 rounded-sm">
              <Link className="inline " size={15}></Link>
              <Paragraph className="inline align-middle ml-1 text-xs">
                0
              </Paragraph>
            </div>
          </div>
          <div className="flex -space-x-2">
            {/* Get 3 first assignee */}
            {task.assignments.slice(0, 3).map((assignment) => {
              const img = ["/avatar.png", "/avatar2.png"];
              const idx = Math.floor(Math.random() * 2);
              return (
                <Avatar
                  key={assignment.assignee.id}
                  className="border-2 border-white -space-x-2"
                >
                  <AvatarImage
                    src={img[idx]}
                    alt={`@${assignment.assignee.name}`}
                  ></AvatarImage>
                  <AvatarFallback>
                    {getInitial(assignment.assignee)}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {task.assignments.length > 3 && (
              <Avatar className="border-2 border-white">
                <AvatarFallback>+{task.assignments.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
