"use client";
import React, { useEffect, useMemo, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { CreateTenantInput, createTenantSchema } from "@schemas/tenant.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTenantAction, updateTenantAction } from "@actions/tenants.action";
import FormProvider from "@ui/hook-form/FormProvider";
import { RHFInput } from "@ui/hook-form";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";
import { Heading } from "../heading";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Tenant } from "@prisma/client";

type Props = {
  edit?: boolean;
  currentTenant?: Tenant | null;
};

export default function TenantForm({ edit, currentTenant }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues = useMemo(
    () => ({
      name: currentTenant?.name || "",
      address: currentTenant?.address || "",
      contactEmail: currentTenant?.contactEmail || "",
      contactPhone: currentTenant?.contactPhone || "",
    }),
    [currentTenant]
  );
  const methods = useForm<CreateTenantInput>({
    defaultValues,
    resolver: zodResolver(createTenantSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentTenant, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateTenantInput> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("contactEmail", data.contactEmail);
    formData.append("contactPhone", data.contactPhone);

    // if (edit && areObjectsEqual(data, defaultValues)) {
    //   toast.info("No changes made.");
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const result = edit
        ? await updateTenantAction(formData, currentTenant?.id as string)
        : await createTenantAction(formData);

      if (result.success) {
        toast.success(result.msg);
        reset(); // Reset the form after successful submission
      } else {
        toast.error(result.msg);
        console.log(result.msg);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeIn className=" space-y-3 pt-10">
      <DynamicBreadcrumb />

      <Heading className=" font-display pb-4">
        {edit ? "Update tenant" : "Add tenant"}
      </Heading>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <div className="grid gap-2">
            <RHFInput name="name" label="Tenant Name" id="name" />
          </div>
          <div className="grid gap-2">
            <RHFInput name="address" label="Address" id="address" />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFInput
              name="contactEmail"
              label="Contact Email"
              type="email"
              id="contactEmail"
            />

            <RHFInput name="contactPhone" label="Contact Phone" id="contactPhone" />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6  w-44 font-bold font-display items-center"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update Tenant" : "Create Tenant"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
