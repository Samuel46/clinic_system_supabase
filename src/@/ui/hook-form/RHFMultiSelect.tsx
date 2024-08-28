import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormMessage } from "@ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";

import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
  CommandSeparator,
} from "@ui/command";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { Badge } from "@ui/badge";

interface Option {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface Props {
  name: string;
  label: string;
  options: Option[];
}

export default function RHFMultiSelect({ name, label, options }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues = new Set(field.value || []);

        return (
          <FormItem>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      error ? "bg-red-200 hover:bg-red-100" : "bg-white",
                      "h-8  px-6  text-base/6 text-neutral-500 ring-4    w-full justify-start py-[2.7rem] rounded-2xl border border-neutral-300 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                    )}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    {label}
                    {selectedValues.size > 0 && (
                      <>
                        <Separator orientation="vertical" className="mx-2 h-5" />
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal lg:hidden"
                        >
                          {selectedValues.size}
                        </Badge>
                        <div className="hidden space-x-1 lg:flex">
                          {selectedValues.size > 2 ? (
                            <Badge
                              variant="secondary"
                              className="rounded-sm px-1 font-normal"
                            >
                              {selectedValues.size} selected
                            </Badge>
                          ) : (
                            options
                              .filter((option) => selectedValues.has(option.value))
                              .map((option) => (
                                <Badge
                                  key={option.value}
                                  variant="secondary"
                                  className="rounded-sm px-1 font-normal"
                                >
                                  <p className="max-w-[100px] truncate">{option.label}</p>
                                </Badge>
                              ))
                          )}
                        </div>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className=" w-[350px] max-w-[400px]">
                    <CommandInput placeholder={label} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => {
                          const isSelected = selectedValues.has(option.value);
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => {
                                if (isSelected) {
                                  selectedValues.delete(option.value);
                                } else {
                                  selectedValues.add(option.value);
                                }
                                field.onChange(Array.from(selectedValues));
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
                      {selectedValues.size > 0 && (
                        <>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => field.onChange([])}
                              className="justify-center text-center"
                            >
                              Clear permissions
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
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
