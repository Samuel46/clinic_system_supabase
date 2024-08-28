"use client";

import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormMessage } from "@ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";

import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@ui/command";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";

interface Option {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface Props {
  name: string;
  label: string;
  options: Option[];
  onSelect?: (value: string) => void; // Added onSelect prop
}

export default function RHFSingleSelect({ name, label, options, onSelect }: Props) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValue = field.value;

        return (
          <FormItem>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-expanded={open}
                    className={cn(
                      error ? "bg-red-200 hover:bg-red-100" : "bg-white",
                      "h-8  px-6   ring-4  ring-transparent transition text-base/6 text-neutral-500    w-full justify-start py-[2.67rem] rounded-2xl border border-neutral-300 relative focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5 group-first:rounded-2xl disabled:cursor-not-allowed disabled:opacity-50 "
                    )}
                  >
                    <ChevronsUpDown className="mr-2 h-5 w-5 absolute right-6" />
                    {selectedValue
                      ? options.find((option) => option.value === selectedValue)?.label
                      : label}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className=" w-[350px] max-w-[400px]">
                    <CommandInput placeholder={label} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => {
                          const isSelected = selectedValue === option.value;
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => {
                                field.onChange(option.value);
                                if (onSelect) onSelect(option.value); // Call onSelect when an item is selected
                              }}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <CheckIcon className={cn("h-4 w-4")} />
                              </div>
                              {option.icon && (
                                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              )}
                              <p className="truncate text-wrap w-[200px]">
                                {option.label}
                              </p>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
              {error?.message}
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
