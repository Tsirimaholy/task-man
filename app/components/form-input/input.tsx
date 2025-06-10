import type React from "react";
import { Input as ShcnInput } from "~/components/ui/input";
import { Paragraph } from "../typography";

interface InputProps extends React.ComponentProps<"input"> {
  isError?: boolean;
  errorMessage?: string;
}

function Input({ isError = false, errorMessage, ...props }: InputProps) {
  return (
    <>
      {" "}
      <ShcnInput
        className={isError ? "border-red-600 text-red-600 bg-red-100" : ""}
        {...props}
      />
      {isError && (
        <Paragraph
          className="text-red-600 text-xs"
        >
          {isError && errorMessage}
        </Paragraph>
      )}
    </>
  );
}
export default Input;
