import type React from "react";
import { cn } from "~/lib/utils";

interface LabelProps extends React.ComponentProps<"label"> {
  isError?: boolean;
}

const Label: React.FC<LabelProps> = ({
  isError=false,
  className,
  children,
  ...props
}) => {
  return (
    <label
      className={cn(`font-bold ${isError ? "text-red-600" : ""}`, className)}
      {...props}
    >
      {children}
    </label>
  );
};
export default Label;
