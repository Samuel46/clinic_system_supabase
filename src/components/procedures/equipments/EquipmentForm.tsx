"use client";

import { Divider } from "@/components/divider";
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import { addEquipmentToProcedureAction } from "@actions/procedures.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Component, Procedure, ProcedureEquipment, ProcedureStep } from "@prisma/client";
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
import EquipmentItems from "./EquipmentItems";
import { getNewInputs } from "@utils/equipmentUtils";
import ProcedureSteps from "../ProcedureSteps";

type Props = {
  edit?: boolean;
  currentEquipments: ProcedureEquipment[];
  currentProcedure: Procedure;
  currentSteps: ProcedureStep[];
  equipments: Component[];
};

export default function EquipmentForm({
  currentEquipments,
  edit,
  currentProcedure,
  equipments,
  currentSteps,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      equipment:
        (currentEquipments &&
          currentEquipments.map((equipment) => ({
            equipmentId: equipment.equipmentId ?? "",
            quantity: equipment.quantity ?? 1,
          }))) ||
        [],
    }),
    [currentEquipments]
  );

  const methods = useForm<UpsertStepsOrEquipmentsInput>({
    defaultValues,
    resolver: zodResolver(upsertStepsOrEquipmentsSteps),
  });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentEquipments, defaultValues, reset]);

  const watchedEquipment = watch("equipment") ?? [];

  const newInputs = getNewInputs(currentEquipments, watchedEquipment);

  const onSubmit: SubmitHandler<UpsertStepsOrEquipmentsInput> = async (data) => {
    try {
      setIsLoading(true);

      const currentEquipmentsSet = new Set(currentEquipments.map((e) => e.equipmentId));

      // Check for duplicates in the new inputs
      const duplicates = newInputs.filter((item) =>
        currentEquipmentsSet.has(item.equipmentId)
      );

      const equipmentMap = new Map(equipments.map((item) => [item.id, item.name]));

      if (duplicates.length > 0) {
        duplicates.forEach((item) => {
          const equipmentName = equipmentMap.get(item.equipmentId);
          toast.error(
            `Equipment '${equipmentName}' (ID: ${item.equipmentId})  already exists.`
          );
        });
        reset(); // Reset form or handle as needed
        setIsLoading(false);
        return;
      }

      let result;

      if (edit && currentEquipments) {
        const hasChanges =
          JSON.stringify(currentEquipments) !== JSON.stringify(data.equipment);

        if (hasChanges) {
          result = await addEquipmentToProcedureAction(
            currentProcedure.id,
            data.equipment ?? []
          );
        } else {
          toast.info("No changes detected");
          return;
        }
      } else {
        result = await addEquipmentToProcedureAction(
          currentProcedure.id,
          data.equipment ?? []
        );
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
    <FadeIn className=" space-y-6">
      <DynamicBreadcrumb />

      <ProcedureSteps
        id={currentProcedure?.id}
        currentProcedure={Boolean(currentProcedure)}
        currentEquipments={Boolean(currentEquipments.length)}
        currentSteps={Boolean(currentSteps.length)}
      />
      <Heading className=" font-display text-sm">
        {edit && !Boolean(newInputs.length)
          ? "Update procedure equipment"
          : "Add procedure equipment"}
      </Heading>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <EquipmentItems equipments={currentEquipments ?? []} supplies={equipments} />

          <Button
            disabled={isLoading}
            type="submit"
            variant={edit && !Boolean(newInputs.length) ? "secondary" : "default"}
            className="place-self-end"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit && !Boolean(newInputs.length)
              ? "Update equipments"
              : "Create equipments"}
          </Button>
        </div>
      </FormProvider>
      {edit && !Boolean(newInputs.length) && (
        <div className="flex  flex-col space-y-6 items-end">
          <Divider />
          <Button
            type="submit"
            onClick={() =>
              startTransition(() => router.push(`/admin/treatments/procedures/list`))
            }
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Finish
            <ChevronRight className=" size-4" />
          </Button>
        </div>
      )}
    </FadeIn>
  );
}
