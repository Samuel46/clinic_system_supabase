import { CheckIcon } from "@heroicons/react/24/solid";
import { MedicalCheckup, MedicalRecord, Treatment } from "@prisma/client";
import { BadgeCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type Step = {
  id: string;
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming" | "complete-current";
};

type Props = {
  currentCheckup?: MedicalCheckup | null;
  currentTreatment?: Treatment | null;
  currentMedicalRecord?: MedicalRecord | null;
  id: string;
};

const AppointmentSteps: React.FC<Props> = ({
  currentCheckup,
  currentTreatment,
  currentMedicalRecord,
  id,
}) => {
  const pathname = usePathname();

  const steps: Step[] = useMemo(() => {
    return [
      {
        id: "01",
        name: "Medical checkup",
        href: `/admin/appointments/check-up?id=${id}`,
        status:
          pathname?.startsWith(`/admin/appointments/check-up`) && currentCheckup
            ? "complete-current"
            : currentCheckup
            ? "complete"
            : pathname?.startsWith(`/admin/appointments/check-up`)
            ? "current"
            : "upcoming",
      },
      {
        id: "02",
        name: "Treatment",
        href: `/admin/appointments/treatment?id=${id}`,
        status:
          pathname?.startsWith(`/admin/appointments/treatment`) && currentTreatment
            ? "complete-current"
            : currentTreatment
            ? "complete"
            : pathname?.startsWith(`/admin/appointments/treatment`)
            ? "current"
            : "upcoming",
      },
      {
        id: "03",
        name: "Medical record",
        href: `/admin/appointments/medical-record?id=${id}`,
        status:
          pathname?.startsWith(`/admin/appointments/medical-record`) &&
          currentMedicalRecord
            ? "complete-current"
            : currentMedicalRecord
            ? "complete"
            : pathname?.startsWith(`/admin/appointments/medical-record`)
            ? "current"
            : "upcoming",
      },
    ];
  }, [pathname, currentCheckup, currentTreatment, currentMedicalRecord, id]);

  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-2xl border border-gray-300 md:flex md:divide-y-0 bg-muted/50"
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === "complete-current" ? (
              <a href={step.href} className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 group-hover:bg-blue-900">
                    <BadgeCheck aria-hidden="true" className="h-6 w-6 text-white " />
                  </span>
                  <span className="ml-4 text-sm font-medium text-slate-900 group-hover:underline   underline-offset-2">
                    {step.name}
                  </span>
                </span>
              </a>
            ) : step.status === "complete" ? (
              <a href={step.href} className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black group-hover:bg-slate-800">
                    <CheckIcon aria-hidden="true" className="h-6 w-6 text-white" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900 group-hover:underline   underline-offset-2">
                    {step.name}
                  </span>
                </span>
              </a>
            ) : step.status === "current" ? (
              <a
                href={step.href}
                aria-current="step"
                className="flex items-center px-6 py-4 text-sm font-medium"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-black">
                  <span className="text-black">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-black group-hover:underline   underline-offset-2">
                  {step.name}
                </span>
              </a>
            ) : (
              <a href={step.href} className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">
                      {step.id}
                    </span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900 group-hover:underline   underline-offset-2">
                    {step.name}
                  </span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 hidden h-full w-5 md:block"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 22 80"
                    preserveAspectRatio="none"
                    className="h-full w-full text-gray-300"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default AppointmentSteps;
