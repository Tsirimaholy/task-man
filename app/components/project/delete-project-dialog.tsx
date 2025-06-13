import type { Project } from "generated/prisma/client";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { action } from "~/routes/projects";

interface DeleteProjectDialogProps {
  project: Project;
  children?: React.ReactNode;
}

export function DeleteProjectDialog({
  project,
  children,
}: DeleteProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  // // Close dialog on successful deletion
  // useEffect(() => {
  //   const isSuccess =
  //     navigation.state === "idle" &&
  //     !actionData?.error &&
  //     actionData?.success &&
  //     actionData?.deletedProject?.id === project.id;
  //   if (isSuccess && open) {
  //     setOpen(false);
  //   }
  // }, [navigation.state, actionData, open, project.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the project{" "}
            <strong>"{project.name}"</strong> ?
            <br />
            This action cannot be undone and will permanently delete all tasks,
            comments, and data associated with this project.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Warning: This action is irreversible
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  All project data including tasks, comments, attachments, and
                  member associations will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Form method="post">
          <input type="hidden" name="intent" value="delete-project" />
          <input type="hidden" name="projectId" value={project.id.toString()} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting} onClick={()=>setOpen(false)}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
