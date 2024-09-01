import { Appointment, AppointmentStatus, DayOff, Patient, User } from "@prisma/client";
import { CreatePatientInput } from "../@/schemas/patients.schemas";
import { format } from "date-fns";
import { SessionUser } from "@type/index";

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function hasDataChanged(currentData: any, newData: any): boolean {
  return !deepEqual(currentData, newData);
}

export function getInitials(name: string): string {
  const nameParts = name.split(" ").filter(Boolean);
  if (nameParts.length === 0) {
    return "";
  }

  const initials = nameParts
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials;
}

export const transformAppointment = (
  item: (Appointment & { patient: Patient; doctor: User }) | null,
  user?: SessionUser
) => ({
  id: item?.id ?? "",
  time: `${format(new Date(item?.startTime ?? new Date()), "p")} to ${format(
    new Date(item?.endTime ?? new Date()),
    "p"
  )}`,
  date: item?.date ?? new Date(),
  patient: item?.patient.name ?? "",
  doctor: item?.doctor.name ?? "",
  reason: item?.reason ?? "",
  status: item?.status ?? AppointmentStatus.SCHEDULED,
  createdAt: item?.createdAt ?? new Date(),
  updatedAt: item?.updatedAt ?? new Date(),
  role: user?.role ?? "",
});

// Function to create Date objects for 9 AM and 5 PM
export const createTime = (hours: number, minutes: number): Date => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Default workDays for Monday to Friday, 9 AM to 5 PM

export const getKenyanPublicHolidays = () => {
  const currentYear = new Date().getFullYear();
  return [
    {
      name: "New Year's Day",
      date: new Date(currentYear, 0, 1),
      reason: "Public Holiday",
    }, // January 1st
    { name: "Madaraka Day", date: new Date(currentYear, 5, 1), reason: "Public Holiday" }, // June 1st
    {
      name: "Mashujaa Day",
      date: new Date(currentYear, 9, 20),
      reason: "Public Holiday",
    }, // October 20th
    {
      name: "Jamhuri Day",
      date: new Date(currentYear, 11, 12),
      reason: "Public Holiday",
    }, // December 12th
    {
      name: "Christmas Day",
      date: new Date(currentYear, 11, 25),
      reason: "Public Holiday",
    }, // December 25th
  ];
};

export const areDayOffsEqual = (
  daysOff1: Omit<DayOff, "scheduleId" | "id">[],
  daysOff2: Omit<DayOff, "scheduleId" | "id">[]
): boolean => {
  if (daysOff1.length !== daysOff2.length) return false;

  return daysOff1.every((dayOff, index) => {
    const dayOff2 = daysOff2[index];
    return (
      dayOff.name === dayOff2.name &&
      dayOff.reason === dayOff2.reason &&
      new Date(dayOff.date).getTime() === new Date(dayOff2.date).getTime() // Compare dates as timestamps
    );
  });
};
