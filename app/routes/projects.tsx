import prisma from "~/lib/prisma";
import type { Route } from "./+types/projects";
import { DataTable } from "~/components/project/data-table";
import { columns } from "~/components/project/columns";
import SearchInput from "~/components/ui/SearchInput";
import { useState } from "react";

export const loader = async ({ }: Route.LoaderArgs) => {
  const projects = await prisma.project.findMany();
  return { projects };
};
export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredProjects = projects.filter(
    (project) =>
      project.name.includes(searchTerm) ||
      project.description?.includes(searchTerm)
  );

  return (
    <div className="mt-2">
      <div className="flex mb-2 justify-end">
        <div className="content-end items-center">
          <SearchInput
            className="w-auto"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredProjects} />
    </div>
  );
}
