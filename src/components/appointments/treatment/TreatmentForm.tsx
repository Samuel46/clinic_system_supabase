"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Divider } from "@/components/divider";
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import { upsertTreatmentForAppointmentAction } from "@actions/appointments.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Appointment, MedicalCheckup, MedicalRecord, Treatment } from "@prisma/client";
import { UpsertTreatmentToAppointmentInput, upsertTreatmentToAppointmentSchema } from "@schemas/appointment.schemas";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import FormProvider from "@ui/hook-form";
import { Icons } from "@ui/icons";

import AppointmentSteps from "../details/AppointmentSteps";
import TreatmentItems from "./TreatmentItems";

type Props = {
	currentTreatment?: Treatment[] | null;
	currentCheckup?: MedicalCheckup | null;
	user: SessionUser | undefined;
	appointment: Appointment | null;
	currentMedicalRecord?: MedicalRecord | null;
	treatments: Treatment[];
};
export default function TreatmentForm({
	currentTreatment,
	user,
	appointment,
	currentCheckup,
	currentMedicalRecord,
	treatments,
}: Props) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();

	const defaultValues = useMemo(
		() => ({
			treatment:
				(currentTreatment?.length &&
					currentTreatment.map((item) => ({
						id: item.id,
						tenantId: item.tenantId,
						name: item.name,
						doctorId: item.doctorId,
						type: item.type,
						description: item.description,
					}))) ||
				[],
		}),
		[currentTreatment]
	);

	const methods = useForm<UpsertTreatmentToAppointmentInput>({
		defaultValues,
		resolver: zodResolver(upsertTreatmentToAppointmentSchema),
	});

	const { handleSubmit, reset } = methods;

	useEffect(() => {
		reset(defaultValues);
	}, [currentTreatment, defaultValues, reset]);

	const onSubmit: SubmitHandler<UpsertTreatmentToAppointmentInput> = async (data) => {
		try {
			setIsLoading(true);
			let result;

			result = await upsertTreatmentForAppointmentAction(appointment?.id ?? "", data?.treatment ?? []);

			if (result.success) {
				toast.success(result.msg);
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
		<FadeIn className=" space-y-6 pt-10 grid">
			<DynamicBreadcrumb />

			<AppointmentSteps
				id={appointment?.id ?? ""}
				currentCheckup={currentCheckup}
				currentMedicalRecord={currentMedicalRecord}
				currentTreatment={currentTreatment?.[0] ?? null}
			/>

			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<Heading className=" font-display pb-4">{currentTreatment ? "Update Treatment" : "Add Treatment"}</Heading>
				<div className="grid gap-6  ">
					<TreatmentItems appointmentId={appointment?.id ?? ""} treatment={treatments ?? []} />

					<Button
						disabled={isLoading}
						type="submit"
						variant={!currentTreatment ? "default" : "secondary"}
						className=" p-6  font-bold place-self-start"
					>
						{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
						{currentTreatment ? "Update Treatment" : "add Treatment"}
					</Button>

					<Divider />
				</div>
			</FormProvider>
			{currentTreatment && (
				<Button
					type="submit"
					onClick={() => startTransition(() => router.push(`/admin/appointments/medical-record?id=${appointment?.id}`))}
					className=" p-6  font-bold  place-self-end items-center"
				>
					{isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
					Medical record
					<ChevronRight className=" size-5" />
				</Button>
			)}
		</FadeIn>
	);
}
