"use client";

import { createProcedureAction, updateProcedureAction } from "@actions/procedures.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { CreateProcedureInput, createProcedureSchema } from "@schemas/procedure.schemas";
import { SessionUser } from "@type/index";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";
import FormProvider, { RHFInput } from "@ui/hook-form";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import ProcedureSteps from "./ProcedureSteps";
import { Divider } from "../divider";
import { ChevronRight } from "lucide-react";

type Props = {
  edit?: boolean;
  currentProcedure?: Prisma.ProcedureGetPayload<{
    include: { steps: true; equipment: true };
  }> | null;
  user?: SessionUser;
};
export default function ProcedureForm({ currentProcedure, user, edit }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentProcedure?.name ?? "",
      description: currentProcedure?.description ?? "",
      tenantId: user?.tenantId!,
      userId: user?.id,
    }),
    [currentProcedure, user]
  );

  const methods = useForm<CreateProcedureInput>({
    defaultValues,
    resolver: zodResolver(createProcedureSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  const hasChanges =
    watch("name") !== currentProcedure?.name ||
    watch("description") !== currentProcedure?.description;

  useEffect(() => {
    reset(defaultValues);
  }, [currentProcedure, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateProcedureInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      if (edit && currentProcedure?.id) {
        if (!hasChanges) {
          toast.info("No changes detected.");
          setIsLoading(false);
          return;
        }

        result = await updateProcedureAction(data, currentProcedure.id);
      } else {
        result = await createProcedureAction(data);
      }

      if (result.success) {
        if (!edit) {
          router.push(`/admin/treatments/procedures/create?id=${result.data?.id}`);
        }

        toast.success(result.msg);
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
    <FadeIn className=" space-y-6 ">
      <DynamicBreadcrumb />
      <ProcedureSteps
        id={currentProcedure?.id}
        currentProcedure={Boolean(currentProcedure)}
        currentEquipments={Boolean(currentProcedure?.equipment.length)}
        currentSteps={Boolean(currentProcedure?.steps.length)}
      />
      <div className="flex w-full flex-wrap items-center justify-between gap-4   dark:border-white/10">
        <Heading className=" font-display text-sm ">
          {edit ? "Update procedure info" : "Add procedure info"}
        </Heading>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 w-full">
          <div className="grid gap-2">
            <RHFInput name="name" label="Name" id="name" />
          </div>

          <RHFTextArea name="description" label="Description" />

          <Button
            disabled={isLoading}
            type="submit"
            variant={edit && !Boolean(hasChanges) ? "secondary" : "default"}
            className="place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update procedure info" : "Continue"}
          </Button>
        </div>
      </FormProvider>

      {!Boolean(hasChanges) && (
        <div className="flex  flex-col space-y-6  items-end">
          <Divider />
          <Button
            type="submit"
            onClick={() =>
              startTransition(() => router.push(`steps?id=${currentProcedure?.id}`))
            }
          >
            {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            Continue
            <ChevronRight className=" size-4" />
          </Button>
        </div>
      )}
    </FadeIn>
  );
}
