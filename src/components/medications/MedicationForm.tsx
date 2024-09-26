"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";
import FormProvider from "@ui/hook-form/FormProvider";
import { RHFInput } from "@ui/hook-form";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { Medication, MedicationUnit } from "@prisma/client";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import {
  CreateMedicationInput,
  createMedicationSchema,
  unitOptions,
} from "@schemas/medications.schemas";
import {
  createMedicationAction,
  createMedicationSampleAction,
  updateMedicationAction,
} from "@actions/medications.action";
import { SessionUser } from "@type/index";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";

type Props = {
  edit?: boolean;
  currentMedication?: Medication | null;
  user: SessionUser | undefined;
};
export default function MedicationForm({ edit, currentMedication, user }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const defaultValues: CreateMedicationInput = useMemo(
    () => ({
      tenantId: user?.tenantId!,
      name: currentMedication?.name || "",
      description: currentMedication?.description || "",
      price: currentMedication?.price || 0,
      unit: currentMedication?.unit || MedicationUnit.PILLS,
    }),
    [currentMedication, user]
  );

  const methods = useForm<CreateMedicationInput>({
    defaultValues,
    resolver: zodResolver(createMedicationSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentMedication]);

  const onSubmit: SubmitHandler<CreateMedicationInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      // Determine if we are in edit mode and if there are any changes
      if (edit && currentMedication) {
        const hasChanges =
          data.name !== currentMedication.name ||
          data.description !== currentMedication.description ||
          data.price !== currentMedication.price ||
          data.unit !== currentMedication.unit;

        if (hasChanges) {
          result = await updateMedicationAction(currentMedication.id, data);
        } else {
          toast.info("No changes detected");
          setIsLoading(false);
          return;
        }
      } else {
        // Call the create medication action with form data
        result = await createMedicationAction(data);
      }

      if (result.success) {
        // Show success notification
        toast.success(result.msg);
        router.push("/admin/inventory/medications");
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
    <FadeIn className=" space-y-6">
      <DynamicBreadcrumb />
      <div className="flex w-full flex-wrap items-center justify-between gap-4 dark:border-white/10">
        <Heading className=" font-display">
          {edit ? "Update medication" : "Add medication"}
        </Heading>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 w-full">
          <div className="grid grid-cols-2 gap-2">
            <RHFInput name="name" label="Medication name" />
            <RHFInput name="price" type="number" label="Price" id="price" />
          </div>

          <div className="grid gap-2">
            <RHFSingleSelect
              options={unitOptions}
              name="unit"
              label="Units e.g. pills, bottles, etc."
            />
          </div>

          <div className="grid gap-2">
            <RHFTextArea name="description" label="Description" />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="items-center place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update medication" : "Create medication"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
