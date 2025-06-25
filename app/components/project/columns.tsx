import { type ColumnDef } from "@tanstack/react-table";
import type { Project } from "generated/prisma/client";
import { href, NavLink } from "react-router";
import { Button } from "../ui/button";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { EditProjectDialog } from "./edit-project-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// type TProject = {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: Date;
//   updatedAt: Date;
//   createdById: number;
// };

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Button asChild variant={"link"}>
          <NavLink
            to={href("/projects/:projectId/tasks", {
              projectId: row.original.id.toString(),
            })}
          >
            {row.getValue("name")}
          </NavLink>
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 412,
    cell: ({ row }) => {
      return <div className="text-wrap">{row.getValue("description")}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => row.original.updatedAt.toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex items-center gap-2">
          <EditProjectDialog project={project} />
          <DeleteProjectDialog project={project} />
        </div>
      );
    },
  },
];
