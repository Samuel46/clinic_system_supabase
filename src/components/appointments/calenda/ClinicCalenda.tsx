import React, { useState } from "react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Calendar } from "@ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { Label } from "@ui/label";

const initialAppointments = [
  {
    id: 1,
    patientName: "Rafli Jannudin",
    treatment: "General Checkup",
    status: "Finished",
    startTime: "09:00",
    endTime: "10:00",
    doctor: "Drg Soap Mactavish",
  },
  {
    id: 2,
    patientName: "Sekar Nandita",
    treatment: "Scaling",
    status: "Finished",
    startTime: "10:00",
    endTime: "11:00",
    doctor: "Drg Soap Mactavish",
  },
  {
    id: 3,
    patientName: "Angkasa Putra",
    treatment: "Filling",
    status: "Finished",
    startTime: "11:00",
    endTime: "12:00",
    doctor: "Drg Jerald O'Hara",
  },
  {
    id: 4,
    patientName: "Lembayung Senja",
    treatment: "Extraction",
    status: "Doing Treatment",
    startTime: "12:00",
    endTime: "13:00",
    doctor: "Drg Jerald O'Hara",
  },
  {
    id: 5,
    patientName: "Daniswara",
    treatment: "General Checkup",
    status: "Registered",
    startTime: "14:30",
    endTime: "15:30",
    doctor: "Drg Soap Mactavish",
  },
  {
    id: 6,
    patientName: "Raihan",
    treatment: "General Checkup",
    status: "Waiting Payment",
    startTime: "15:30",
    endTime: "16:30",
    doctor: "Drg Putri Larasati",
  },
];

const doctors = [
  { id: 1, name: "Drg Soap Mactavish", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, name: "Drg Jerald O'Hara", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 3, name: "Drg Putri Larasati", avatar: "/placeholder.svg?height=32&width=32" },
];

const treatmentTypes = ["General Checkup", "Scaling", "Filling", "Extraction"];

export default function ClinicCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    treatment: "",
    doctor: "",
    startTime: "",
    endTime: "",
    status: "Registered",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusColors = {
    Finished: "bg-green-100 text-green-800",
    "Doing Treatment": "bg-blue-100 text-blue-800",
    Registered: "bg-yellow-100 text-yellow-800",
    "Waiting Payment": "bg-red-100 text-red-800",
  };

  const renderAppointment = (appointment: (typeof appointments)[0]) => (
    <div
      key={appointment.id}
      className={`rounded-lg p-2 mb-2 ${
        statusColors[appointment.status as keyof typeof statusColors]
      }`}
    >
      <div className="font-semibold">{appointment.patientName}</div>
      <div className="text-sm">{appointment.treatment}</div>
      <div className="text-xs">
        {appointment.startTime} - {appointment.endTime}
      </div>
      <div className="text-xs font-medium mt-1">{appointment.status}</div>
    </div>
  );

  const filteredAppointments =
    selectedDoctor === "all"
      ? appointments
      : appointments.filter((apt) => apt.doctor === selectedDoctor);

  const handleTimeSlotClick = (time: string, doctor: string) => {
    setNewAppointment((prev) => ({
      ...prev,
      startTime: time,
      endTime: `${parseInt(time.split(":")[0]) + 1}:00`,
      doctor: doctor,
    }));
    setIsDialogOpen(true);
  };

  const handleSaveAppointment = () => {
    setAppointments((prev) => [...prev, { ...newAppointment, id: prev.length + 1 }]);
    setIsDialogOpen(false);
    setNewAppointment({
      patientName: "",
      treatment: "",
      doctor: "",
      startTime: "",
      endTime: "",
      status: "Registered",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Zendenta</h1>
            <span className="text-gray-500">Reservations</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for anything here"
                className="pl-10 w-64"
              />
            </div>
            <Button size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </Button>
            <Button size="icon" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Button>
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="Darrell Steward"
              />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">{appointments.length}</span>
            <span className="text-gray-500">total appointments</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Today
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dentists</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-[auto,1fr,1fr,1fr] gap-4 p-4">
          {/* Time Column */}
          <div className="space-y-16 pt-8">
            {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
              <div key={hour} className="text-sm text-gray-500">
                {hour}:00
              </div>
            ))}
          </div>

          {/* Doctor Columns */}
          {doctors.map((doctor) => (
            <div key={doctor.id} className="border-l pl-4">
              <div className="flex items-center space-x-2 mb-4">
                <Avatar>
                  <AvatarImage src={doctor.avatar} alt={doctor.name} />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold">{doctor.name}</span>
              </div>
              <div className="space-y-2">
                {filteredAppointments
                  .filter((apt) => apt.doctor === doctor.name)
                  .map(renderAppointment)}
                {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => {
                  const timeSlot = `${hour}:00`;
                  const hasAppointment = filteredAppointments.some(
                    (apt) => apt.doctor === doctor.name && apt.startTime === timeSlot
                  );
                  if (!hasAppointment) {
                    return (
                      <div
                        key={`${doctor.id}-${timeSlot}`}
                        className="h-16 border-t border-gray-200 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleTimeSlotClick(timeSlot, doctor.name)}
                      />
                    );
                  }
                  return null;
                })}
              </div>
              {doctor.id === 1 && (
                <div className="mt-48 py-2 text-center text-sm text-gray-500 bg-gray-100 rounded">
                  BREAK TIME
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details for the new appointment. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">
                Patient Name
              </Label>
              <Input
                id="patientName"
                value={newAppointment.patientName}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, patientName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="treatment" className="text-right">
                Treatment
              </Label>
              <Select
                value={newAppointment.treatment}
                onValueChange={(value) =>
                  setNewAppointment({ ...newAppointment, treatment: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select treatment" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentTypes.map((treatment) => (
                    <SelectItem key={treatment} value={treatment}>
                      {treatment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">
                Doctor
              </Label>
              <Input
                id="doctor"
                value={newAppointment.doctor}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                value={newAppointment.startTime}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                value={newAppointment.endTime}
                readOnly
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveAppointment}>
              Save appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
