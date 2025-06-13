import type { Route } from "./+types/projects";
import { DataTable } from "~/components/project/data-table";
import { columns } from "~/components/project/columns";
import SearchInput from "~/components/ui/search-input";
import { useEffect, useState } from "react";
import { useActionData, useNavigation } from "react-router";
import { Paragraph } from "~/components/typography";
import { requireIsAuthenticated } from "~/lib/auth";
import { getMyProjects, createProject } from "~/queries/projects";
import { CreateProjectDialog } from "~/components/project/create-project-dialog";
import { validateProjectData } from "~/lib/validation";
import { toast } from "sonner";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await requireIsAuthenticated(request);
  const projects = await getMyProjects(user?.id!);
  return { projects };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await requireIsAuthenticated(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create-project") {
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();

    // Validation
    const validation = validateProjectData({ name, description });

    if (!validation.isValid) {
      return { fieldErrors: validation.errors };
    }

    try {
      const project = await createProject({
        name: name!.trim(),
        description: description?.trim() || undefined,
        createdById: user!.id,
      });

      return {
        success: true,
        message: `Project "${project.name}" created successfully!`,
        project,
      };
    } catch (error) {
      console.error("Error creating project:", error);
      return { error: "Failed to create project. Please try again." };
    }
  }

  return { error: "Invalid action" };
};

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const actionData = useActionData();
  const navigation = useNavigation();
  const filteredProjects = projects.filter(
    (project) =>
      project.name.includes(searchTerm) ||
      project.description?.includes(searchTerm)
  );

  // Show toast notifications and refresh data based on action results
  useEffect(() => {
    if (navigation.state === "idle" && actionData) {
      if (actionData.success && actionData.message) {
        toast("Project created successfully", {
          description: actionData.message,
        });
      } else if (actionData.error) {
        toast("Error", {
          description: actionData.error,
        });
      }
    }
  }, [navigation.state, actionData, toast]);

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
          <CreateProjectDialog />
        </div>
      </div>
      <DataTable columns={columns} data={filteredProjects} />
    </div>
  );
}
