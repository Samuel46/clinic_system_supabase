import React from "react";

import { RecordForm } from "@/components/appointments/record";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

interface Props {
	searchParams: {
		id: string;
	};
}

async function getData(id: string) {
	const appointment = await prisma_next.appointment.findUnique({
		where: {
			id,
		},

		include: {
			medicalCheckup: true,
			treatment: {
				include: {
					doctor: true,
					procedure: true,
				},
			},
			medicalRecord: true,
		},
	});

	return { appointment };
}
export default async function RecordFormPage({ searchParams: { id } }: Props) {
	const user = await getCurrentUser();

	const { appointment } = await getData(id);

	return (
		<RecordForm
			appointment={appointment}
			user={user}
			checkup={appointment?.medicalCheckup}
			treatments={appointment?.treatment}
			currentMedicalRecord={appointment?.medicalRecord}
		/>
	);
}
