import { useEffect, useState } from "react";
import { useActionData, useNavigation } from "react-router";
import { toast } from "sonner";
import { columns } from "~/components/project/columns";
import { CreateProjectDialog } from "~/components/project/create-project-dialog";
import { DataTable } from "~/components/project/data-table";
import { Paragraph } from "~/components/typography";
import SearchInput from "~/components/ui/search-input";
import { requireIsAuthenticated } from "~/lib/auth";
import { validateProjectData } from "~/lib/validation";
import { createProject, deleteProject, getMyProjects, updateProject } from "~/queries/projects";
import type { Route } from "./+types/projects";


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

  if (intent === "edit-project") {
    const projectId = formData.get("projectId")?.toString();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();

    if (!projectId) {
      return { error: "Project ID is required" };
    }

    // Validation
    const validation = validateProjectData({ name, description });

    if (!validation.isValid) {
      return { fieldErrors: validation.errors };
    }

    try {
      const updatedProject = await updateProject(parseInt(projectId), user!.id, {
        name: name!.trim(),
        description: description?.trim() || undefined,
      });

      return {
        success: true,
        message: `Project "${updatedProject.name}" updated successfully`,
        updatedProject,
      };
    } catch (error) {
      console.error("Error updating project:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update project. Please try again.";
      return { error: errorMessage };
    }
  }

  if (intent === "delete-project") {
    const projectId = formData.get("projectId")?.toString();

    if (!projectId) {
      return { error: "Project ID is required" };
    }

    try {
      const deletedProject = await deleteProject(parseInt(projectId), user!.id);
      return {
        success: true,
        message: `Project "${deletedProject.name}" deleted successfully`,
        deletedProject,
      };
    } catch (error) {
      console.error("Error deleting project:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete project. Please try again.";
      return { error: errorMessage };
    }
  }

  return { error: "Invalid action" };
};

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const actionData = useActionData<typeof action>();
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
        if (actionData.project) {
          toast["success"]("Project created successfully", {
            description: actionData.message,
          });
        } else if (actionData.updatedProject) {
          toast["success"]("Project updated successfully", {
            description: actionData.message,
          });
        } else if (actionData.deletedProject) {
          toast["success"]("Project deleted successfully", {
            description: actionData.message,
          });
        }
      } else if (actionData.error) {
        toast["error"]("Error", {
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
