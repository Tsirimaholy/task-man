import prisma from "~/lib/prisma";
import type { Route } from "./+types/projects";
import { DataTable } from "~/components/project/data-table";
import { columns } from "~/components/project/columns";
import SearchInput from "~/components/ui/search-input";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Paragraph } from "~/components/typography";
import { isAuthenticated } from "~/lib/auth";
import { href, redirect } from "react-router";
import { authCookieStorage } from "~/lib/session";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const isAuthentic = await isAuthenticated(request);
  const session = await authCookieStorage.getSession(
    request.headers.get("cookie")
  );
  if (!isAuthentic) {
    return redirect(href("/login"), {
      headers: {
        "set-cokie": await authCookieStorage.destroySession(session),
      },
    });
  }
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
    <div className="mt-8">
      <div className="flex mb-3 items-center justify-between gap-3">
        <Paragraph textColorClassName="text-muted-foreground">
          Manage your created projects
        </Paragraph>
        <div className="flex gap-3">
          <div className="content-end items-center">
            <SearchInput
              placeholder="Search projects"
              className="w-auto"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle />
            Create project
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={filteredProjects} />
    </div>
  );
}
