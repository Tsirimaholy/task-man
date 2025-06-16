import type { TaskStatus } from "generated/prisma/client";
import {
  CheckCircle2,
  Circle,
  Eye,
  LucideSquaresSubtract,
  type LucideProps,
} from "lucide-react";
import { forwardRef } from "react";

type BoardStatusIconProps = {
  status: TaskStatus;
} & LucideProps;

const BoardStatusIcon = forwardRef<SVGSVGElement, BoardStatusIconProps>(
  ({ status, size = 15, ...props }, ref) => {
    if (status === "TODO")
      return (
        <Circle
          size={size}
          className="text-muted-foreground"
          {...props}
          ref={ref}
        ></Circle>
      );
    else if (status === "IN_PROGRESS")
      return (
        <LucideSquaresSubtract
          size={size}
          className="text-muted-foreground"
          {...props}
          ref={ref}
        />
      );
    else if (status === "REVIEW")
      return (
        <Eye
          size={size}
          className="text-muted-foreground"
          {...props}
          ref={ref}
        />
      );
    else
      return (
        <CheckCircle2
          size={size}
          className={"text-muted-foreground"}
          {...props}
          ref={ref}
        />
      );
  }
);
export default BoardStatusIcon;
