"use client";

import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";

import { upsertEquipmentToTreatmentAction } from "@actions/treatment.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Component, Prisma } from "@prisma/client";

import {
  UpsertTreatmentEquipments,
  upsertTreatmentEquipments,
} from "@schemas/treament.schemas";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import FormProvider from "@ui/hook-form";
import { getNewInputs } from "@utils/index";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import EquipmentItems from "./EquipmentItems";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { Divider } from "@/components/divider";
import { ChevronRight } from "lucide-react";

type Props = {
  currentTreatment: Prisma.TreatmentGetPayload<{
    include: {
      treatmentEquipments: true;
    };
  }> | null;

  equipments: Component[];
  edit: boolean;
};
export default function AddEquipmentForm({ currentTreatment, equipments, edit }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentEquipments = currentTreatment?.treatmentEquipments;

  const defaultValues = useMemo(
    () => ({
      treatmentEquipments:
        (currentTreatment?.treatmentEquipments.length &&
          currentTreatment.treatmentEquipments.map((equipment) => ({
            componentId: equipment.componentId ?? "",
            quantity: equipment.quantity ?? 1,
            treatmentId: currentTreatment.id,
          }))) ||
        [],
    }),
    [currentTreatment]
  );

  const methods = useForm<UpsertTreatmentEquipments>({
    defaultValues,
    resolver: zodResolver(upsertTreatmentEquipments),
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentTreatment?.treatmentEquipments, defaultValues, reset]);

  const watchedEquipment = watch("treatmentEquipments") ?? [];

  const newInputs = getNewInputs(
    currentTreatment?.treatmentEquipments ?? [],
    watchedEquipment
  );

  const onSubmit: SubmitHandler<UpsertTreatmentEquipments> = async (data) => {
    try {
      setIsLoading(true);

      const currentEquipmentsSet = new Set(
        currentTreatment?.treatmentEquipments.map((e) => e.componentId)
      );

      // Check for duplicates in the new inputs
      const duplicates = newInputs.filter((item) =>
        currentEquipmentsSet.has(item.componentId)
      );

      const equipmentMap = new Map(equipments.map((item) => [item.id, item.name]));

      if (duplicates.length > 0) {
        duplicates.forEach((item) => {
          const equipmentName = equipmentMap.get(item.componentId);
          toast.error(
            `Equipment '${equipmentName}' (ID: ${item.componentId})  already exists.`
          );
        });
        reset(); // Reset form or handle as needed
        setIsLoading(false);
        return;
      }

      let result;

      if (edit && currentEquipments) {
        const hasChanges =
          JSON.stringify(currentEquipments) !== JSON.stringify(data.treatmentEquipments);

        if (hasChanges) {
          result = await upsertEquipmentToTreatmentAction(
            currentTreatment.id,
            data.treatmentEquipments ?? []
          );
        } else {
          toast.info("No changes detected");
          return;
        }
      } else {
        result = await upsertEquipmentToTreatmentAction(
          currentTreatment?.id ?? "",
          data.treatmentEquipments ?? []
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
    <div className=" space-y-6 pt-10">
      <DynamicBreadcrumb />

      <Heading className=" font-display ">
        {edit && !Boolean(newInputs.length)
          ? "Update treatment equipment"
          : "Add treatment equipment"}
      </Heading>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <EquipmentItems equipments={currentEquipments ?? []} supplies={equipments} />

          {Boolean(watchedEquipment.length) && (
            <Button
              disabled={isLoading}
              type="submit"
              variant={edit && !Boolean(newInputs.length) ? "secondary" : "default"}
              className=" py-6    items-center place-self-end"
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {edit && !Boolean(newInputs.length)
                ? "Update equipments"
                : "Create equipments"}
            </Button>
          )}
        </div>
      </FormProvider>
      {edit && !Boolean(newInputs.length) && (
        <div className="flex  flex-col space-y-6  items-end">
          <Divider />
          <Button
            className=" font-semibold p-6"
            type="submit"
            onClick={() => startTransition(() => router.push(`/admin/treatments`))}
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Finish
            <ChevronRight className=" size-5" />
          </Button>
        </div>
      )}

      {!edit && !Boolean(watchedEquipment.length) && (
        <div className="flex  flex-col space-y-6  items-end">
          <Divider />
          <Button
            className=" font-semibold p-6"
            type="submit"
            onClick={() => startTransition(() => router.push(`/admin/treatments`))}
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Skip
            <ChevronRight className=" size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
