"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";
import FormProvider from "@ui/hook-form/FormProvider";
import { RHFDatePicker, RHFInput } from "@ui/hook-form";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { Inventory, InventoryLocation, Medication } from "@prisma/client";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { SessionUser } from "@type/index";

import { CreateInventoryInput, createInventorySchema } from "@schemas/inventory.schemas";
import { createInventoryAction, updateInventoryAction } from "@actions/inventory.action";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";

type Props = {
  edit?: boolean;
  currentInventory?: Inventory | null;
  user: SessionUser | undefined;
  medications: Medication[];
};
export default function InventoryForm({
  edit,
  currentInventory,
  user,
  medications,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultValues: CreateInventoryInput = useMemo(
    () => ({
      medicationId: currentInventory?.medicationId || "",
      tenantId: user?.tenantId!,
      quantity: currentInventory?.quantity || 0,
      threshold: currentInventory?.threshold || 0,
      expirationDate: currentInventory?.expirationDate || undefined,
      location: currentInventory?.location || InventoryLocation.SHELF,
    }),
    [currentInventory, user]
  );

  const methods = useForm<CreateInventoryInput>({
    defaultValues,
    resolver: zodResolver(createInventorySchema),
  });

  const medicationOptions = medications.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const inventoryLocationOptions = Object.values(InventoryLocation).map((location) => ({
    value: location,
    label: location.replace("_", " "),
  }));

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentInventory]);

  const onSubmit: SubmitHandler<CreateInventoryInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      // Determine if we are in edit mode and if there are any changes
      if (edit && currentInventory) {
        const hasChanges =
          currentInventory.medicationId !== data.medicationId ||
          currentInventory.tenantId !== data.tenantId ||
          currentInventory.quantity !== data.quantity ||
          currentInventory.threshold !== data.threshold ||
          currentInventory.expirationDate?.getTime() !== data.expirationDate?.getTime() ||
          currentInventory.location !== data.location;

        if (hasChanges) {
          result = await updateInventoryAction(currentInventory.id, data);
        } else {
          toast.info("No changes detected");
          setIsLoading(false);
          return;
        }
      } else {
        // Call the create medication action with form data
        result = await createInventoryAction(data);
      }

      if (result.success) {
        // Show success notification
        toast.success(result.msg);
        router.back();
      } else {
        // Show error notification
        toast.error(result.msg);
      }
    } catch (error) {
      console.error("Failed to submit medication:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <FadeIn>
      <div className="flex w-full flex-wrap items-center justify-between gap-4  pb-6 dark:border-white/10">
        <Heading className=" font-display ">
          {edit ? "Update inventory" : "Add inventory"}
        </Heading>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 w-full">
          <div className="grid gap-2">
            <RHFSingleSelect
              name="medicationId"
              label="Select medication"
              options={medicationOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RHFInput name="threshold" label="Threshold" type="number" />
            <RHFInput name="quantity" type="number" label="Quantity" id="quantity" />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFDatePicker name="expirationDate" label="Expiration date" />

            <RHFSingleSelect
              name="location"
              options={inventoryLocationOptions}
              label="Location (optional)"
            />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6   font-bold font-display items-center place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update inventory" : "Create inventory"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
