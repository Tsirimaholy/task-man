import { type ColumnDef } from "@tanstack/react-table";
import type { Project } from "generated/prisma/client";
import { href, NavLink } from "react-router";

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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <NavLink
          className="text-wrap"
          to={href("/projects/:projectId/tasks", {
            projectId: row.getValue("id"),
          })}
        >
          {row.getValue("name")}
        </NavLink>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="text-wrap">
          {row.getValue("description")}
        </div>
      );
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
    accessorKey: "createdById",
    header: "Created By ID",
  },
];
