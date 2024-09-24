"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";

import { Component } from "@prisma/client";
import { CreateComponentInput, createComponentSchema } from "@schemas/component.schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createComponentAction, updateComponentAction } from "@actions/components.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormProvider, { RHFInput } from "@ui/hook-form";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { SessionUser } from "@type/index";

type Props = {
  edit?: boolean;
  currentComponent?: Component | null;
  user?: SessionUser;
};
export default function SuppliesForm({ edit, currentComponent, user }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      userId: user?.id,
      tenantId: user?.tenantId,
      name: currentComponent?.name || "",
      description: currentComponent?.description || "",
      unitCost: currentComponent?.unitCost || 0,
    }),
    [currentComponent, user]
  );

  const methods = useForm<CreateComponentInput>({
    defaultValues,
    resolver: zodResolver(createComponentSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateComponentInput> = async (data) => {
    setIsLoading(true);

    try {
      if (edit && currentComponent) {
        // Check for changes before updating
        const hasChanges =
          data.name !== currentComponent.name ||
          data.description !== currentComponent.description ||
          data.unitCost !== currentComponent.unitCost;

        if (!hasChanges) {
          toast.info("No changes detected.");
          setIsLoading(false);
          return;
        }

        // Update component if changes detected
        const result = await updateComponentAction(currentComponent.id, data);

        if (result.success) {
          toast.success(result.msg);
          router.push("/admin/supplies");
        } else {
          toast.error(result.msg);
        }
      } else {
        // Create new component
        const result = await createComponentAction(data);

        if (result.success) {
          toast.success(result.msg);
          reset();
          router.push("/admin/supplies");
        } else {
          toast.error(result.msg);
        }
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <FadeIn className=" space-y-3 pt-10">
      <DynamicBreadcrumb />

      <Heading className=" font-display pb-4">
        {edit ? "Update supply" : "Add supply"}
      </Heading>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <div className="grid  grid-cols-2 gap-x-4">
            <RHFInput
              name="name"
              label="Component Name"
              placeholder="Enter component name"
            />

            <RHFInput
              name="unitCost"
              label="Unit Cost"
              type="number"
              placeholder="Enter unit cost"
            />
          </div>

          <RHFTextArea
            name="description"
            label="Description"
            placeholder="Enter component description"
          />

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6 flex  items-center place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update supply" : "Create supply"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
