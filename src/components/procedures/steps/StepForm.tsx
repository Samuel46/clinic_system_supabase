"use client";

import { Divider } from "@/components/divider";
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import { addStepsToProcedureAction } from "@actions/procedures.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Procedure, ProcedureEquipment, ProcedureStep } from "@prisma/client";
import {
  UpsertStepsOrEquipmentsInput,
  upsertStepsOrEquipmentsSteps,
} from "@schemas/procedure.schemas";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import FormProvider from "@ui/hook-form";
import { Icons } from "@ui/icons";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import StepItems from "./StepItems";
import { getNewInputs } from "@utils/index";
import ProcedureSteps from "../ProcedureSteps";

type Props = {
  edit?: boolean;
  currentSteps: ProcedureStep[];
  currentProcedure: Procedure;
  currentEquipments: ProcedureEquipment[];
};

export default function StepForm({
  currentSteps,
  edit,
  currentProcedure,
  currentEquipments,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      steps:
        (currentSteps &&
          currentSteps?.map((item) => ({
            stepNumber: item?.stepNumber ?? 1,
            description: item?.description ?? "",
            duration: item?.duration ?? 30,
            role: item?.role ?? "Surgeon",
          }))) ||
        [],
    }),
    [currentSteps]
  );

  const methods = useForm<UpsertStepsOrEquipmentsInput>({
    defaultValues,
    resolver: zodResolver(upsertStepsOrEquipmentsSteps),
  });

  const { handleSubmit, reset, watch } = methods;

  const watchedSteps = watch("steps") ?? [];

  const newInputs = getNewInputs(currentSteps, watchedSteps as ProcedureStep[]);

  useEffect(() => {
    reset(defaultValues);
  }, [currentSteps, defaultValues, reset]);

  const onSubmit: SubmitHandler<UpsertStepsOrEquipmentsInput> = async (data) => {
    try {
      setIsLoading(true);

      let result;

      if (edit && currentSteps) {
        const hasChanges = JSON.stringify(currentSteps) !== JSON.stringify(data.steps);

        if (hasChanges) {
          result = await addStepsToProcedureAction(currentProcedure.id, data.steps ?? []);
        } else {
          toast.info("No changes detected");
          return;
        }
      } else {
        result = await addStepsToProcedureAction(currentProcedure.id, data.steps ?? []);
      }

      if (result.success) {
        toast.success(result.msg);
        router.refresh();
        // router.push(`equipments?id=${currentProcedure.id}`);
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      console.error("Failed to submit steps:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <FadeIn className=" space-y-6 pt-10">
      <DynamicBreadcrumb />

      <ProcedureSteps
        id={currentProcedure?.id}
        currentProcedure={Boolean(currentProcedure)}
        currentEquipments={Boolean(currentEquipments.length)}
        currentSteps={Boolean(currentSteps.length)}
      />

      <Heading className=" font-display ">
        {edit && !Boolean(newInputs.length)
          ? "Update procedure step"
          : "Add procedure step"}
      </Heading>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <StepItems steps={currentSteps ?? []} />
          <Button
            disabled={isLoading}
            type="submit"
            variant={edit && !Boolean(newInputs.length) ? "secondary" : "default"}
            className=" py-6    items-center place-self-end"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit && !Boolean(newInputs.length) ? "Update steps" : "Create steps"}
          </Button>
        </div>
      </FormProvider>
      {edit && !Boolean(newInputs.length) && (
        <div className="flex  flex-col space-y-6  items-end">
          <Divider />
          <Button
            className=" font-semibold p-6"
            type="submit"
            onClick={() =>
              startTransition(() => router.push(`equipments?id=${currentProcedure.id}`))
            }
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Continue
            <ChevronRight className=" size-5" />
          </Button>
        </div>
      )}
    </FadeIn>
  );
}
