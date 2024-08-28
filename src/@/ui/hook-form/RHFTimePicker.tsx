"use client";

import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Button } from "@ui/button";

import { cn } from "@lib/utils";
import { format, setHours, setMinutes, parse, isDate } from "date-fns";
import { FormControl, FormDescription, FormItem } from "@ui/form";
import { ScrollArea } from "@ui/scroll-area";
import { ClockIcon } from "lucide-react";

type Props = {
  name: string;
  label: string;
};

const RHFTimePicker: React.FC<Props> = ({ name, label }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { control } = useFormContext();

  const times = Array.from({ length: (23 - 7) * 2 + 1 }).map((_, index) => {
    const hour = 7 + Math.floor(index / 2);
    const minute = (index % 2) * 30;
    const time = setMinutes(setHours(new Date(), hour), minute);
    return {
      label: format(time, "HH:mm a"),
      value: time,
    };
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="flex flex-col">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    error?.message
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-slate-600",
                    "w-full text-base/6 text-neutral-950 ring-4 pl-6 text-left font-normal bg-transparent border py-[2.7rem] rounded-2xl border-neutral-300 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value && isDate(field.value) ? (
                    format(field.value, "HH:mm a")
                  ) : (
                    <span
                      className={cn(
                        error?.message ? "text-red-600" : "text-base/6 text-neutral-500"
                      )}
                    >
                      {label}
                    </span>
                  )}
                  <ClockIcon
                    className={cn(
                      "ml-auto mr-5 h-4 w-4 opacity-50",
                      error?.message && "text-destructive"
                    )}
                  />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="center">
              <ScrollArea className="h-48">
                <div className="flex flex-col p-2">
                  {times.map((time) => (
                    <Button
                      key={time.label}
                      variant="ghost"
                      onClick={() => {
                        field.onChange(time.value);
                        setOpen(false);
                      }}
                    >
                      {time.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <FormDescription className="text-[0.8rem] font-medium text-destructive">
            {error?.message}
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default RHFTimePicker;
