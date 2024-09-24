"use client";
import { format } from "date-fns";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/description-list";
import { Divider } from "@/components/divider";
import { FadeIn } from "@/components/FadeIn";
import { Heading, Subheading } from "@/components/heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { updateAppointmentStatusAction } from "@actions/appointments.action";
import { createMedicalRecordAction, updateMedicalRecordAction } from "@actions/medicalRecords.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { broadcastAppointmentUpdate } from "@lib/supabase/client";
import { cn } from "@lib/utils";
import { Appointment, FollowUpPeriod, MedicalCheckup, MedicalRecord, Prisma } from "@prisma/client";
import { CreateMedicalRecordInput, createMedicalRecordSchema } from "@schemas/medicalRecord.schemas";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import FormProvider from "@ui/hook-form/FormProvider";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { Icons } from "@ui/icons";
import { Label } from "@ui/label";
import { fDate } from "@utils/formatTime";

import AppointmentSteps from "../details/AppointmentSteps";

type Props = {
	edit?: boolean;
	currentMedicalRecord?: MedicalRecord | null;
	user: SessionUser | undefined;
	appointment: Appointment | null;
	treatments?: Prisma.TreatmentGetPayload<{ include: { doctor: true; procedure: true } }>[] | null;
	checkup?: MedicalCheckup | null;
};

export default function RecordForm({ edit = false, currentMedicalRecord, treatments, checkup, user, appointment }: Props) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	const defaultValues = useMemo(
		() => ({
			tenantId: user?.tenantId,
			patientId: appointment?.patientId,
			doctorId: user?.id,
			appointmentId: appointment?.id,
			treatments: treatments?.map((treatment) => treatment.id),
			checkupId: checkup?.id,
			reasonForVisit: currentMedicalRecord?.reasonForVisit || appointment?.reason,
			followUp: currentMedicalRecord?.followUp || FollowUpPeriod.NO_FOLLOW_UP,
		}),
		[currentMedicalRecord, user, appointment, checkup, treatments]
	);
	const methods = useForm<CreateMedicalRecordInput>({
		defaultValues,
		resolver: zodResolver(createMedicalRecordSchema),
	});

	const { handleSubmit, reset, watch } = methods;

	const userInput = watch();

	const currentMedicalRecordData = {
		tenantId: currentMedicalRecord?.tenantId || "",
		patientId: currentMedicalRecord?.patientId || "",
		doctorId: currentMedicalRecord?.doctorId || "",
		appointmentId: currentMedicalRecord?.appointmentId || "",
		reasonForVisit: currentMedicalRecord?.reasonForVisit,
		followUp: currentMedicalRecord?.followUp || FollowUpPeriod.ONE_WEEK,
		treatments: treatments?.map((treatment) => treatment.id),
		checkupId: currentMedicalRecord?.checkupId || null, // Add this line
	};

	const hasChanges = Object.keys(userInput).some(
		(key) =>
			JSON.stringify(userInput[key as keyof CreateMedicalRecordInput]) !==
			JSON.stringify(currentMedicalRecordData[key as keyof CreateMedicalRecordInput])
	);

	useEffect(() => {
		reset(defaultValues);
	}, [currentMedicalRecord, defaultValues, reset]);

	const onSubmit: SubmitHandler<CreateMedicalRecordInput> = async (data) => {
		try {
			setIsLoading(true);
			let result;

			if (currentMedicalRecord) {
				if (!hasChanges) {
					toast.info("No changes detected, update not needed.");
					setIsLoading(false);
					return;
				}

				result = await updateMedicalRecordAction(currentMedicalRecord.id, data);
			} else {
				result = await createMedicalRecordAction(data);
			}

			if (result.success) {
				toast.success(result.msg);

				console.log(result.data, "data here");
				if (edit && currentMedicalRecord) {
					router.back();
				}

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

	const handleCompleteAppointment = async () => {
		startTransition(() => {
			updateAppointmentStatusAction({
				id: appointment?.id ?? "",
				status: "COMPLETED",
			}).then((result) => {
				if (result.success) {
					toast.success(result.msg);
					// Refresh or redirect logic here
					router.refresh(); // or use router.push to navigate

					broadcastAppointmentUpdate(result?.data ?? null);

					router.push(`/admin/patients/${appointment?.patientId}`);
				} else {
					toast.error(result.msg);
				}
			});
			router.refresh();
		});
	};

	return (
		<FadeIn className=" space-y-6 pt-10 grid">
			<DynamicBreadcrumb />

			<AppointmentSteps
				currentCheckup={checkup}
				currentTreatment={treatments?.[0]}
				currentMedicalRecord={currentMedicalRecord}
				id={appointment?.id ?? ""}
			/>

			<Heading className=" font-display pb-4">
				{currentMedicalRecord ? "Update medical record" : "Add medical record"}
			</Heading>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<div className="grid gap-6  ">
					<>
						<Subheading>Assigned treatments</Subheading>

						<Table striped grid className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
							<TableHead>
								<TableRow>
									<TableHeader>Treatment Type</TableHeader>
									<TableHeader>Description</TableHeader>
									<TableHeader>Date</TableHeader>
									<TableHeader>Doctor</TableHeader>
									<TableHeader>Procedure</TableHeader>
								</TableRow>
							</TableHead>
							<TableBody>
								{treatments?.map((treatment) => (
									<TableRow title={treatment.id} className="cursor-pointer" key={treatment.id}>
										<TableCell>{treatment.type}</TableCell>
										<TableCell className="max-w-[150px] text-pretty">{treatment.description}</TableCell>
										<TableCell>{fDate(treatment.createdAt)}</TableCell>
										<TableCell>{treatment.doctor.name}</TableCell>
										<TableCell className=" text-balance max-w-[150px]">
											{treatment.procedure ? treatment.procedure.name : "N/A"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</>

					<Divider />

					<>
						<Subheading>Checkup Information</Subheading>
						<DescriptionList>
							<DescriptionTerm>Checkup Date</DescriptionTerm>
							<DescriptionDetails>{format(checkup?.checkupDate ?? new Date(), "PPP")}</DescriptionDetails>

							<DescriptionTerm>Blood Pressure</DescriptionTerm>
							<DescriptionDetails>{checkup?.bloodPressure}</DescriptionDetails>

							<DescriptionTerm>Heart Rate</DescriptionTerm>
							<DescriptionDetails>{checkup?.heartRate} bpm</DescriptionDetails>

							<DescriptionTerm>Respiratory Rate</DescriptionTerm>
							<DescriptionDetails>{checkup?.respiratoryRate ?? "N/A"} breaths per minute</DescriptionDetails>

							<DescriptionTerm>Temperature</DescriptionTerm>
							<DescriptionDetails>{checkup?.temperature ?? "N/A"} °F</DescriptionDetails>

							<DescriptionTerm>Oxygen Saturation</DescriptionTerm>
							<DescriptionDetails>{checkup?.oxygenSaturation ?? "N/A"} %</DescriptionDetails>

							<DescriptionTerm>Weight</DescriptionTerm>
							<DescriptionDetails>{checkup?.weight ?? "N/A"} lbs</DescriptionDetails>

							<DescriptionTerm>Height</DescriptionTerm>
							<DescriptionDetails>{checkup?.height ?? "N/A"} inches</DescriptionDetails>

							<DescriptionTerm>BMI</DescriptionTerm>
							<DescriptionDetails>{checkup?.bmi ?? "N/A"}</DescriptionDetails>

							<DescriptionTerm>Additional Notes</DescriptionTerm>
							<DescriptionDetails>{checkup?.notes ?? "None"}</DescriptionDetails>
						</DescriptionList>
					</>

					<Divider />

					<div className="grid gap-4 ">
						<Subheading>Follow-Up and Visit Details</Subheading>

						<Label htmlFor="followUp" className={cn("text-base/6 text-neutral-500  transition-all duration-200")}>
							Follow Up
						</Label>
						<RHFSingleSelect
							name="followUp"
							label="Follow Up"
							options={Object.values(FollowUpPeriod).map((type) => ({
								value: type,
								label: type.charAt(0) + type.slice(1).toLowerCase(),
							}))}
						/>
					</div>

					<RHFTextArea name="reasonForVisit" label="Reason for Visit" />

					{!edit && (
						<Button
							disabled={isLoading || !hasChanges}
							type="submit"
							variant={currentMedicalRecord && !hasChanges ? "secondary" : "default"}
							className=" py-6  w-44 font-bold font-display items-center"
						>
							{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
							{currentMedicalRecord ? "Update record" : "Create record"}
						</Button>
					)}
				</div>
			</FormProvider>

			{currentMedicalRecord && !edit && (
				<>
					<Divider />
					<Button
						type="submit"
						disabled={hasChanges}
						variant={hasChanges ? "secondary" : "default"}
						onClick={() => handleCompleteAppointment()}
						className=" p-6  font-bold  place-self-end items-center"
					>
						{isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
						Finish
						<BadgeCheck className="ml-2 size-4" />
					</Button>
				</>
			)}
		</FadeIn>
	);
}
