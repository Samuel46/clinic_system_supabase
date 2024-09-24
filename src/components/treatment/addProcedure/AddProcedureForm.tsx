"use client";

import { Divider } from "@/components/divider";
import { Heading } from "@/components/heading";
import { updateTreatmentAction } from "@actions/treatment.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma, Procedure, TreatmentType } from "@prisma/client";
import { CreateTreatmentInput, createTreatmentSchema } from "@schemas/treament.schemas";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import FormProvider from "@ui/hook-form";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { Icons } from "@ui/icons";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  procedures: Procedure[];
  currentTreatment: Prisma.TreatmentGetPayload<{ include: { procedure: true } }> | null;
  user?: SessionUser;
};
export default function AddProcedureForm({ procedures, currentTreatment, user }: Props) {
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
      procedureId: currentTreatment?.procedureId ?? "",
    }),
    [currentTreatment, user]
  );

  const methods = useForm<CreateTreatmentInput>({
    defaultValues,
    resolver: zodResolver(createTreatmentSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentTreatment, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateTreatmentInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      result = await updateTreatmentAction(currentTreatment?.id ?? "", data);

      if (result.success) {
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
    <div className=" space-y-6 pt-10 grid">
      <DynamicBreadcrumb />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-wrap items-center justify-between gap-4  border-zinc-950/10 dark:border-white/10">
          <Heading className=" font-display pb-4">
            {currentTreatment?.procedure ? "Update procedure" : "Add procedure"}
          </Heading>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/procedures/create")}
            >
              New procedure
            </Button>
          </div>
        </div>

        <div className="grid pt-6 gap-6">
          <RHFSingleSelect
            name="procedureId"
            label="Procedure"
            options={procedures.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
          {watch("procedureId") && (
            <Button
              disabled={isLoading}
              type="submit"
              variant={!currentTreatment?.procedure ? "default" : "secondary"}
              className=" p-6  font-bold place-self-start"
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {currentTreatment?.procedure ? "Update procedure" : "Add procedure"}
            </Button>
          )}

          <Divider />
        </div>
      </FormProvider>

      {currentTreatment?.procedure && (
        <Button
          type="submit"
          onClick={() =>
            startTransition(() =>
              router.push(`/admin/treatments/add-equipments?id=${currentTreatment.id}`)
            )
          }
          className=" p-6  font-bold  place-self-end items-center"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
          <ChevronRight className=" size-5" />
        </Button>
      )}
      {!currentTreatment?.procedure && !watch("procedureId") && (
        <Button
          type="submit"
          onClick={() =>
            startTransition(() =>
              router.push(`/admin/treatments/add-equipments?id=${currentTreatment?.id}`)
            )
          }
          className=" p-6  font-bold  place-self-end items-center"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Skip
          <ChevronRight className=" size-5" />
        </Button>
      )}
    </div>
  );
}
