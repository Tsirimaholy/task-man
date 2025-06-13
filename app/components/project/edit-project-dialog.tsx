import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Edit2 } from "lucide-react";
import type { Project } from "generated/prisma/client";
import type { action } from "~/routes/projects";

interface EditProjectDialogProps {
  project: Project;
  children?: React.ReactNode;
}

export function EditProjectDialog({ project, children }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  // Close dialog on successful update
  useEffect(() => {
    const isSuccess = navigation.state === "idle" && !actionData?.error && actionData?.success && actionData?.updatedProject?.id === project.id;
    if (isSuccess && open) {
      setOpen(false);
    }
  }, [navigation.state, actionData, open, project.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="edit-project" />
          <input type="hidden" name="projectId" value={project.id.toString()} />
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name *
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter project name"
              defaultValue={project.name}
              required
              disabled={isSubmitting}
              autoFocus
            />
            {actionData?.fieldErrors?.name && (
              <p className="text-sm text-red-600">{actionData.fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter project description (optional)"
              defaultValue={project.description || ""}
              rows={3}
              disabled={isSubmitting}
            />
            {actionData?.fieldErrors?.description && (
              <p className="text-sm text-red-600">{actionData.fieldErrors.description}</p>
            )}
          </div>
          {actionData?.error && (
            <p className="text-sm text-red-600">{actionData.error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Update Project
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
