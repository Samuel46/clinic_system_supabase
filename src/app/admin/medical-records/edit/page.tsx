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
	const record = await prisma_next.medicalRecord.findUnique({
		where: {
			id,
		},

		include: {
			checkups: true,
			treatments: {
				include: {
					doctor: true,
					procedure: true,
				},
			},
			appointment: true,
		},
	});

	return { record };
}
export default async function RecordFormPage({ searchParams: { id } }: Props) {
	const user = await getCurrentUser();

	const { record } = await getData(id);

	return (
		<RecordForm
			appointment={record?.appointment ?? null}
			user={user}
			checkup={record?.checkups}
			treatments={record?.treatments}
			currentMedicalRecord={record}
			edit
		/>
	);
}
