"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";

import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { fDateTime } from "@utils/formatTime";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { SelectSingleEventHandler } from "react-day-picker";

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? "AM" : "PM";
  return `${hour}${period}`;
});

export default function Example() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  const container = useRef<HTMLDivElement | null>(null);
  const containerNav = useRef<HTMLDivElement | null>(null);
  const containerOffset = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current && containerNav.current && containerOffset.current) {
      // Set the container scroll position based on the current time.
      const currentMinute = new Date().getHours() * 60;
      container.current.scrollTop =
        ((container.current.scrollHeight -
          containerNav.current.offsetHeight -
          containerOffset.current.offsetHeight) *
          currentMinute) /
        1440;
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            <time dateTime={date.toDateString()} className="sm:hidden">
              {fDateTime(date)}
            </time>
            <time dateTime={date.toDateString()} className="hidden sm:inline">
              {fDateTime(date)}
            </time>
          </h1>
          <p className="mt-1 text-sm text-gray-500">{format(date, "EEEE")}</p>
        </div>
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <ChevronDownIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate as SelectSingleEventHandler | undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <div className="flex border rounded-md">
              <Button
                variant={view === "day" ? "secondary" : "ghost"}
                onClick={() => setView("day")}
                className="rounded-r-none"
              >
                Day
              </Button>
              <Button
                variant={view === "week" ? "secondary" : "ghost"}
                onClick={() => setView("week")}
                className="rounded-l-none"
              >
                Week
              </Button>
            </div>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add appointment
            </button>
          </div>

          <div className="flex border rounded-md relative ml-6 md:hidden">
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              onClick={() => setView("day")}
              className="rounded-r-none"
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              onClick={() => setView("week")}
              className="rounded-l-none"
            >
              Week
            </Button>
          </div>
        </div>
      </header>

      <div className="isolate flex flex-auto overflow-hidden bg-white">
        <div ref={container} className="flex flex-auto flex-col overflow-auto">
          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {hours.map((hour, index) => (
                  <>
                    <div key={hour}>
                      <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {hour}
                      </div>
                    </div>
                    <div key={`spacer-${index}`} />
                  </>
                ))}
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{ gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto" }}
              >
                <li className="relative mt-px flex" style={{ gridRow: "74 / span 12" }}>
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                  >
                    <p className="order-1 font-semibold text-blue-700">Breakfast</p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-22T06:00">6:00 AM</time>
                    </p>
                  </a>
                </li>
                <li className="relative mt-px flex" style={{ gridRow: "92 / span 30" }}>
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
                  >
                    <p className="order-1 font-semibold text-pink-700">Flight to Paris</p>
                    <p className="order-1 text-pink-500 group-hover:text-pink-700">
                      John F. Kennedy International Airport
                    </p>
                    <p className="text-pink-500 group-hover:text-pink-700">
                      <time dateTime="2022-01-22T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li>
                <li className="relative mt-px flex" style={{ gridRow: "134 / span 18" }}>
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs leading-5 hover:bg-indigo-100"
                  >
                    <p className="order-1 font-semibold text-indigo-700">Sightseeing</p>
                    <p className="order-1 text-indigo-500 group-hover:text-indigo-700">
                      Eiffel Tower
                    </p>
                    <p className="text-indigo-500 group-hover:text-indigo-700">
                      <time dateTime="2022-01-22T11:00">11:00 AM</time>
                    </p>
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
