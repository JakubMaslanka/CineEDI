"use client";

import {
  InputHTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";

import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

interface MultiSelectProps {
  inputProps: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
  data: Array<{ value: number; label: string }>;
  selectedIds?: MultiSelectProps["data"][number]["value"][];
  onSelectedChanged: (
    value: MultiSelectProps["data"][number]["value"][]
  ) => void;
}

export function MultiSelect({
  data,
  inputProps,
  selectedIds,
  onSelectedChanged,
}: MultiSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MultiSelectProps["data"]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (item: MultiSelectProps["data"][number]) => {
      setSelected((prev) => {
        const newSelected = prev.filter((s) => s.value !== item.value);
        onSelectedChanged(newSelected.map(({ value }) => value));
        return newSelected;
      });
    },
    [onSelectedChanged]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = data.filter(
    (item) => !selected.map(({ value }) => value).includes(item.value)
  );

  useEffect(() => {
    const initialSelectedValue =
      data.filter((item) => (selectedIds ?? []).includes(item.value)) ?? [];
    setSelected(initialSelectedValue);
  }, [data, selectedIds]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-0">
        <div className="flex gap-1 flex-wrap">
          {selected.map((item) => (
            <Badge key={item.value} variant="secondary">
              {item.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(item);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(item)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            className={cn(
              selected.length > 0 && "ml-2",
              "bg-transparent h-[22px] text-sm border-none ring-none rounded-lg outline-none placeholder:text-muted-foreground flex-1 focus:border-none focus:ring-0"
            )}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((item) => (
                <CommandItem
                  key={item.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={(value) => {
                    setInputValue("");
                    setSelected((prev) => {
                      const newSelectedValue = [...prev, item];
                      onSelectedChanged(
                        newSelectedValue.map(({ value }) => value)
                      );
                      return newSelectedValue;
                    });
                  }}
                  className={"cursor-pointer"}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
