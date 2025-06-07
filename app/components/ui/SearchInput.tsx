import { Search, Slash } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { Input } from "./input";

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  containerClassName?: string;
}

export default function SearchInput({
  className,
  containerClassName="",
  ...props
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "/") {
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", listener);
    () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
  return (
    <div className={cn("text-muted-foreground relative", containerClassName)}>
      <Input
        ref={ref}
        type="search"
        className={cn("pl-7", className)}
        {...props}
      ></Input>
      <Search
        className="absolute top-1/2 translate-y-[-50%] left-1"
        size={20}
      />
      <Slash
        className="absolute top-1/2 translate-y-[-50%] right-1 bg-muted p-1 rounded-sm "
        size={25}
      />
    </div>
  );
}
