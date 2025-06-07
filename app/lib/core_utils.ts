import type { TAssignee } from "~/components/task-board";
import { extractInitial } from "./utils";

export function getInitial(assignee: TAssignee) {
  return assignee.name
    ? extractInitial(assignee.name)
    : assignee.email.substring(0, 2).toUpperCase();
}
