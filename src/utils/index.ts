import { Appointment, AppointmentStatus, Patient, User } from "@prisma/client";
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
