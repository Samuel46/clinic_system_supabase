"use client";

import { createTreatmentAction, updateTreatmentAction } from "@actions/treatment.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Treatment, TreatmentType } from "@prisma/client";
import { CreateTreatmentInput, createTreatmentSchema } from "@schemas/treament.schemas";
import { SessionUser } from "@type/index";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";

import FormProvider, { RHFInput } from "@ui/hook-form";
import { Heading } from "../heading";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { ChevronRight } from "lucide-react";
import { Divider } from "../divider";

type Props = {
  currentTreatment?: Treatment | null;
  user?: SessionUser;
};
export default function TreatmentForm({ currentTreatment, user }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId,
      name: currentTreatment?.name || "",
      doctorId: user?.id,
      type: currentTreatment?.type || TreatmentType.MEDICATION,
      description: currentTreatment?.description || "",
    }),
    [currentTreatment, user]
  );

  const methods = useForm<CreateTreatmentInput>({
    defaultValues,
    resolver: zodResolver(createTreatmentSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentTreatment, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateTreatmentInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      if (currentTreatment?.id) {
        result = await updateTreatmentAction(currentTreatment.id, data);
      } else {
        result = await createTreatmentAction(data);
      }

      if (result.success) {
        toast.success(result.msg);
        router.push(`/admin/treatments/create?id=${result.data?.id}`);
        reset();
      } else {
        toast.error(result.msg);
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
    <div className=" space-y-6 pt-10 grid">
      <DynamicBreadcrumb />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Heading className=" font-display pb-4">
          {currentTreatment ? "Update treatment info" : "Add treatment info"}
        </Heading>
        <div className="grid gap-6  ">
          <div className="grid gap-2 grid-cols-2 w-full">
            <RHFInput name="name" label="Treatment name" />

            <RHFSingleSelect
              name="type"
              label="Treatment Type"
              options={Object.values(TreatmentType).map((type) => ({
                value: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
              }))}
            />
          </div>

          <RHFTextArea name="description" label="Description" />

          <Button
            disabled={isLoading}
            type="submit"
            variant={!currentTreatment ? "default" : "secondary"}
            className=" p-6  font-bold place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {currentTreatment ? "Update treatment info" : "Create treatment info"}
          </Button>

          <Divider />
        </div>
      </FormProvider>
      {currentTreatment && (
        <Button
          type="submit"
          onClick={() =>
            startTransition(() =>
              router.push(`/admin/treatments/add-procedures?id=${currentTreatment.id}`)
            )
          }
          className=" p-6  font-bold  place-self-end items-center"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
          <ChevronRight className=" size-5" />
        </Button>
      )}
    </div>
  );
}
