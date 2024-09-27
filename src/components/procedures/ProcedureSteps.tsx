"use client";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Gradient } from "@ui/gradient";
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
  currentProcedure?: boolean;
  currentSteps?: boolean;
  currentEquipments?: boolean;
  id?: string;
};

const ProcedureSteps: React.FC<Props> = ({
  currentProcedure,
  currentSteps,
  currentEquipments,
  id,
}) => {
  const pathname = usePathname();

  const steps: Step[] = useMemo(() => {
    return [
      {
        id: "01",
        name: "Procedure info",
        href: `/admin/procedures/create?id=${id}`,
        status:
          pathname?.startsWith(`/admin/procedures/create`) && currentProcedure
            ? "complete-current"
            : currentProcedure
            ? "complete"
            : pathname?.startsWith(`/admin/procedures/create`)
            ? "current"
            : "upcoming",
      },
      {
        id: "02",
        name: "Procedure Steps",
        href: currentSteps ? `/admin/procedures/steps?id=${id}` : "#!!",
        status:
          pathname?.startsWith(`/admin/procedures/steps`) && currentSteps
            ? "complete-current"
            : currentSteps
            ? "complete"
            : pathname?.startsWith(`/admin/procedures/steps`)
            ? "current"
            : "upcoming",
      },
      {
        id: "03",
        name: "Procedure Equipments",
        href: currentEquipments ? `/admin/procedures/equipments?id=${id}` : "#!!",
        status:
          pathname?.startsWith(`/admin/procedures/equipments`) && currentEquipments
            ? "complete-current"
            : currentEquipments
            ? "complete"
            : pathname?.startsWith(`/admin/procedures/equipments`)
            ? "current"
            : "upcoming",
      },
    ];
  }, [pathname, currentProcedure, currentSteps, currentEquipments, id]);

  return (
    <nav aria-label="Progress">
      <Gradient className="relative rounded-2xl">
        <ol
          role="list"
          className="divide-y  divide-gray-300 rounded-2xl border border-gray-300 md:flex md:divide-y-0 bg-muted/70 isolate"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === "complete-current" ? (
                <a href={step.href} className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-700 group-hover:bg-fuchsia-900">
                      <BadgeCheck aria-hidden="true" className="h-6 w-6 text-white " />
                    </span>
                    <span className="ml-4 text-sm font-medium text-slate-900 group-hover:underline underline-offset-2">
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
                    <span className="ml-4 text-sm font-medium text-gray-900 group-hover:underline underline-offset-2">
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
                  <span className="ml-4 text-sm font-medium text-black group-hover:underline underline-offset-2">
                    {step.name}
                  </span>
                </a>
              ) : (
                <a href={step.href} className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-500 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">
                        {step.id}
                      </span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-600 group-hover:text-gray-900 group-hover:underline underline-offset-2">
                      {step.name}
                    </span>
                  </span>
                </a>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 22 80"
                      preserveAspectRatio="none"
                      className="h-full w-full text-gray-400"
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
      </Gradient>
    </nav>
  );
};

export default ProcedureSteps;
