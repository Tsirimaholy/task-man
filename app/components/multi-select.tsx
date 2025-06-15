import { useRef, useState, useCallback, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Paragraph } from "./typography";

type SelectData = Record<"value" | "label" | "color", string>;

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectData[];
  selected: SelectData[];
  setSelected: React.Dispatch<React.SetStateAction<SelectData[]>>;
  onSelect?: (selected: SelectData[]) => void;
  onChange?: (selected: SelectData[]) => void;
}

export function MultiSelect({
  label = "",
  placeholder = "",
  options,
  selected,
  setSelected,
  onSelect,
  onChange,
}: MultiSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (unselectedItem: SelectData) => {
      const filteredData = [...selected.filter((s) => s != unselectedItem)];
      setSelected(filteredData);
      onChange && onChange(filteredData);
    },
    [selected]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
            const selectedWithoutLastItem = [...selected];
            selectedWithoutLastItem.pop();
            onChange && onChange(selectedWithoutLastItem);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected]
  );
  const selectables = options.filter(
    (option) => !selected.some((s) => s.value == option.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <Paragraph className="text-sm mb-1" textColorClassName="text-gray-700">
        {label}
      </Paragraph>
      <div className="group rounded-md border-2 border-dotted px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((label) => {
            return (
              <Badge
                key={label.value}
                variant="secondary"
                style={{
                  backgroundColor: label.color + "20",
                  color: label.color,
                }}
              >
                {label.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(label);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(label)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === options.length ? "" : placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((selectItem) => {
                  return (
                    <CommandItem
                      key={selectItem.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, selectItem]);
                        onSelect && onSelect([...selected, selectItem]);
                        onChange && onChange([...selected, selectItem]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {selectItem.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
