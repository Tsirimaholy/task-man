import { useState, useEffect, useRef } from "react";
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
import { PlusCircle } from "lucide-react";

interface CreateProjectDialogProps {
  children?: React.ReactNode;
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const actionData = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = navigation.state === "submitting";

  /**
   * TODO how can i trigger close after the server return a response?
   * how can i know that a action was just triggered
   * Close dialog on successful submission and reset form
   * I nedd a something like
   * try{
   *  setIsSubmiting(true)
   *  await triggerAction()
   *  setOpen(false)
   * }catch{
   *  // do something else
   * }
   **/
  useEffect(() => {
    const isSuccess =
      navigation.state === "idle" && !actionData?.error && actionData?.success;
    if (isSuccess && open) {
      setOpen(false);
      // Reset form after a brief delay to allow dialog to close
      formRef.current?.reset();
    }
    return () => {
    };
  }, [navigation.state, actionData, open]);

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        formRef.current?.reset();
      }, 150);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <PlusCircle />
            Create project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to organize your tasks and collaborate with
            your team.
          </DialogDescription>
        </DialogHeader>
        <Form method="post" className="space-y-4" ref={formRef}>
          <input type="hidden" name="intent" value="create-project" />
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name *
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter project name"
              required
              disabled={isSubmitting}
              autoFocus
            />
            {actionData?.fieldErrors?.name && (
              <p className="text-sm text-red-600">
                {actionData.fieldErrors.name}
              </p>
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
              rows={3}
              disabled={isSubmitting}
            />
            {actionData?.fieldErrors?.description && (
              <p className="text-sm text-red-600">
                {actionData.fieldErrors.description}
              </p>
            )}
          </div>
          {actionData?.error && (
            <p className="text-sm text-red-600">{actionData.error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
