import { format } from "date-fns";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { FormControl, FormDescription, FormItem } from "@ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { fDate } from "@utils/formatTime";

type Props = {
  name: string;
  label: string;
};

export default function RHFDatePicker({ name, label }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className="flex flex-col">
            <Popover open={open} onOpenChange={() => setOpen(!open)}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      error?.message
                        ? "border-red-300   focus:border-red-500 "
                        : "border-gray-300   focus:border-slate-600  ",
                      " pear w-full text-base/6  text-neutral-950 ring-4 pl-6 text-left font-normal bg-transparent border py-[2.7rem] rounded-2xl  border-neutral-300 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5 ",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      fDate(field.value)
                    ) : (
                      <span
                        className={cn(
                          error?.message
                            ? "text-red-600 "
                            : "text-base/6 text-neutral-500",
                          ""
                        )}
                      >
                        {label}
                      </span>
                    )}
                    <CalendarIcon
                      className={cn(
                        "ml-auto mr-5 h-4 w-4 opacity-50",
                        error?.message && "text-destructive"
                      )}
                    />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="" align="center">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription className=" text-[0.8rem] font-medium text-destructive">
              {error?.message}
            </FormDescription>
          </FormItem>
        );
      }}
    />
  );
}
