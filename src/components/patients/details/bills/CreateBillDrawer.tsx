"use client";

import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Patient } from "@prisma/client";
import PatientBillForm from "./PatientBillForm";
import { SessionUser } from "@type/index";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  patient: Patient | null;
  user?: SessionUser;
};

export default function CreateBillDrawer({ setOpen, open, patient, user }: Props) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1">
                  {/* Header */}
                  <div className="bg-muted px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between space-x-3">
                      <div className="flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form here */}
                  <div className=" container">
                    <PatientBillForm patient={patient} setOpen={setOpen} user={user} />
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
