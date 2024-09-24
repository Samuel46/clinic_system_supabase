"use client";
import { ChevronLeft, PenBoxIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/description-list";
import { Divider } from "@/components/divider";
import { FadeIn } from "@/components/FadeIn";
import { Heading, Subheading } from "@/components/heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Prisma } from "@prisma/client";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { fDate } from "@utils/formatTime";

type Props = {
	currentRecord: Prisma.MedicalRecordGetPayload<{
		include: {
			treatments: {
				include: {
					doctor: true;
					procedure: true;
				};
			};
			checkups: true;
			doctor: true;
			patient: true;
		};
	}> | null;
	showPatient?: boolean;
	user?: SessionUser;
};
export default function PatientRecordDetails({ currentRecord, showPatient = true, user }: Props) {
	const router = useRouter();
	return (
		<FadeIn className="py-10 space-y-6">
			{showPatient ? (
				<div className="max-lg:hidden">
					<Button
						variant="link"
						onClick={() => router.back()}
						className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400 -ml-[1.2rem]"
					>
						<ChevronLeft className="size-4  dark:fill-zinc-500" />
						{currentRecord?.patient.name}
					</Button>
				</div>
			) : (
				<DynamicBreadcrumb />
			)}

			<div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-4 dark:border-white/10">
				<Heading>Medical record</Heading>
				<div className="flex gap-4">
					{user?.role === "Admin" && (
						<Button
							onClick={() => router.push(`/admin/medical-records/edit?id=${currentRecord?.id}`)}
							variant="secondary"
						>
							Edit <PenBoxIcon className="ml-2 size-[14px]" />
						</Button>
					)}
				</div>
			</div>

			<>
				<Subheading>Visitation information</Subheading>
				<DescriptionList>
					<DescriptionTerm>Reason for visit</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.reasonForVisit}</DescriptionDetails>

					<DescriptionTerm>Visitation date</DescriptionTerm>
					<DescriptionDetails>{fDate(currentRecord?.visitDate ?? new Date())}</DescriptionDetails>

					<DescriptionTerm>Follow up</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.followUp}</DescriptionDetails>
				</DescriptionList>
			</>

			<Divider />
			<>
				<Subheading>Patient information</Subheading>
				<DescriptionList>
					<DescriptionTerm>Full name</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.patient?.name}</DescriptionDetails>

					<DescriptionTerm>Email address</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.patient?.email}</DescriptionDetails>

					<DescriptionTerm>Phone number</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.patient?.phone}</DescriptionDetails>

					<DescriptionTerm>Date of Birth</DescriptionTerm>
					<DescriptionDetails>{fDate(currentRecord?.patient?.dateOfBirth ?? new Date())}</DescriptionDetails>

					<DescriptionTerm>Medical history</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.patient?.medicalHistory}</DescriptionDetails>

					<DescriptionTerm>Address</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.patient?.address}</DescriptionDetails>

					<DescriptionTerm>Registered on</DescriptionTerm>
					<DescriptionDetails>{fDate(currentRecord?.patient?.createdAt ?? new Date())}</DescriptionDetails>
				</DescriptionList>
			</>

			<Divider />

			<>
				<Subheading>Checkup information</Subheading>

				<DescriptionList>
					<DescriptionTerm> Doctor&apos;s name</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.doctor.name}</DescriptionDetails>

					<DescriptionTerm>Blood Pressure</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.bloodPressure}</DescriptionDetails>

					<DescriptionTerm>Heart Rate</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.heartRate} bpm</DescriptionDetails>

					<DescriptionTerm>Respiratory Rate</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.respiratoryRate} bpm</DescriptionDetails>

					<DescriptionTerm>Temperature</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.temperature ?? "N/A"} °F</DescriptionDetails>

					<DescriptionTerm>Oxygen Saturation</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.oxygenSaturation} %</DescriptionDetails>

					<DescriptionTerm>Weight</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.weight} kg</DescriptionDetails>

					<DescriptionTerm>Height</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.height} cm</DescriptionDetails>

					<DescriptionTerm>BMI</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.bmi}</DescriptionDetails>

					<DescriptionTerm>Notes</DescriptionTerm>
					<DescriptionDetails>{currentRecord?.checkups?.notes}</DescriptionDetails>

					<DescriptionTerm>Checkup date</DescriptionTerm>
					<DescriptionDetails>{fDate(currentRecord?.checkups?.checkupDate ?? new Date())}</DescriptionDetails>
				</DescriptionList>
			</>

			<Divider />

			<>
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
							{currentRecord?.treatments?.map((treatment) => (
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
			</>
		</FadeIn>
	);
}
