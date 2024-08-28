"use client";
import React, { useEffect, useMemo, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormProvider from "@ui/hook-form/FormProvider";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";
import { Heading } from "../heading";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { MedicalRecord, Patient, Tenant } from "@prisma/client";

import {
  CreateMedicalRecordInput,
  createMedicalRecordSchema,
} from "@schemas/medicalRecord.schemas";
import {
  createMedicalRecordAction,
  updateMedicalRecordAction,
} from "@actions/medicalRecords.action";
import { useRouter } from "next/navigation";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { SessionUser } from "@type/index";

type Props = {
  edit?: boolean;
  currentMedicalRecord?: MedicalRecord | null;
  patients: Patient[];
  user: SessionUser | undefined;
};

export default function MedicalRecordForm({
  edit,
  currentMedicalRecord,
  patients,
  user,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: currentMedicalRecord?.tenantId ?? user?.tenantId!,
      patientId: currentMedicalRecord?.patientId ?? "",
      doctorId: currentMedicalRecord?.doctorId ?? user?.id,
    }),
    [currentMedicalRecord, user]
  );

  const methods = useForm<CreateMedicalRecordInput>({
    defaultValues,
    resolver: zodResolver(createMedicalRecordSchema),
  });

  const patientOptions = patients.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentMedicalRecord, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateMedicalRecordInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      if (edit && currentMedicalRecord?.id) {
        // Check for changes before updating
        const hasChanges =
          data.tenantId !== currentMedicalRecord.tenantId ||
          data.patientId !== currentMedicalRecord.patientId ||
          data.doctorId !== currentMedicalRecord.doctorId;

        if (!hasChanges) {
          toast.info("No changes detected.");
          setIsLoading(false);
          return;
        }

        result = await updateMedicalRecordAction(currentMedicalRecord.id, data);
      } else {
        result = await createMedicalRecordAction(data);
      }

      if (result.success) {
        toast.success(result.msg);
        reset();
        // router.push("/medical-records");
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
    <FadeIn className=" space-y-3 pt-10">
      <DynamicBreadcrumb />

      <Heading className=" font-display pb-4">
        {edit ? "Update medical record" : "Add medical record"}
      </Heading>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <RHFSingleSelect
            name="patientId"
            label="Select patient"
            options={patientOptions}
          />
          <div className="grid gap-2">
            <RHFTextArea name="record" label="Record" />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6  w-44 font-bold font-display items-center"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update record" : "Create record"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
