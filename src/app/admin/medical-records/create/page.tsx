import React from "react";

import { MedicalRecordForm } from "@/components/medicalRecord";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

async function getData() {
	const patients = await prisma_next.patient.findMany({
		orderBy: {
			createdAt: "desc",
		},

		include: {
			tenant: true,
		},
	});

	return { patients };
}

export default async function CreateMedicalRecord() {
	const user = await getCurrentUser();

	const { patients } = await getData();
	return <MedicalRecordForm patients={patients} user={user} />;
}
