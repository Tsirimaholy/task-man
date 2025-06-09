import prisma from "~/lib/prisma";
import type { Route } from "./+types/projects";
import { DataTable } from "~/components/project/data-table";
import { columns } from "~/components/project/columns";
import SearchInput from "~/components/ui/SearchInput";

export const loader = async ({}: Route.LoaderArgs) => {
  const projects = await prisma.project.findMany();
  return { projects };
};
export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  return (
    <div className="mt-2">
      <div className="flex mb-2 justify-end">
        <div className="content-end items-center">
          <SearchInput className="w-auto" />
        </div>
      </div>
      <DataTable columns={columns} data={projects} />
    </div>
  );
}
