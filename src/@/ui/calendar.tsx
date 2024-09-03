"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

import { cn } from "@lib/utils";
import { Button, buttonVariants } from "@ui/button";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Divider } from "@/components/divider";
import { Separator } from "./separator";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [month, setMonth] = React.useState<number>(selectedDate?.getMonth() || 0);
  const [year, setYear] = React.useState<number>(
    selectedDate?.getFullYear() || currentYear
  );

  const [openMonth, setOpenMonth] = React.useState<boolean>(false);
  const [openYear, setOpenYear] = React.useState<boolean>(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthSelect = (newMonth: number) => {
    setMonth(newMonth);
    if (selectedDate) {
      setSelectedDate(new Date(year, newMonth, selectedDate.getDate()));
      setOpenMonth(false);
    }
  };

  const handleYearSelect = (newYear: number) => {
    setYear(newYear);
    if (selectedDate) {
      setSelectedDate(new Date(newYear, month, selectedDate.getDate()));
      setOpenYear(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full mb-2 border-b-2 border-dashed pb-4  ">
        <Popover open={openMonth} onOpenChange={setOpenMonth}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 text-sm font-medium text-gray-700"
            >
              {months[month]}
              <ChevronsUpDown className=" size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="  w-[12rem]  p-0" align="end">
            <Command className="w-full">
              <CommandInput placeholder="Search months..." />
              <CommandList className="no-scrollbar px-1">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {months.map((monthName, index) => (
                    <CommandItem key={index} onSelect={() => handleMonthSelect(index)}>
                      {monthName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openYear} onOpenChange={setOpenYear}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 text-sm font-medium text-gray-700"
            >
              {year}
              <ChevronsUpDown className=" size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[12rem]  p-0" align="start">
            <Command>
              <CommandInput placeholder="Search years..." />
              <CommandList className="no-scrollbar px-1">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {Array.from(
                    { length: new Date().getFullYear() - 1900 + 1 },
                    (_, i) => 1900 + i
                  ).map((yearOption) => (
                    <CommandItem
                      key={yearOption}
                      onSelect={() => handleYearSelect(yearOption)}
                    >
                      {yearOption}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <DayPicker
        month={new Date(year, month)}
        onMonthChange={(date) => {
          setMonth(date.getMonth());
          setYear(date.getFullYear());
        }}
        showOutsideDays={showOutsideDays}
        className={cn("flex justify-center w-full mt-4 p-0", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
        }}
        {...props}
      />
    </>
  );
}
Calendar.displayName = "Calendar";

// original
function CalendarOriginal({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
CalendarOriginal.displayName = "CalendarOriginal";

export { Calendar, CalendarOriginal };
