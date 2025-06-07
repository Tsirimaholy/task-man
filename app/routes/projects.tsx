import prisma from "~/lib/prisma";
import type { Route } from "./+types/projects";
import { DataTable } from "~/components/project/data-table";
import { columns } from "~/components/project/columns";

export const loader = async ({}: Route.LoaderArgs) => {
  const projects = await prisma.project.findMany();
  return { projects };
};
export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  return (
    <div>
      <DataTable columns={columns} data={projects}/>
    </div>
  );
}
