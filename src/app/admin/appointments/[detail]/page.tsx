import React from "react";

import { AppointDetails } from "@/components/appointments";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

interface Props {
	params: {
		detail: string;
	};
}

async function getData(id: string) {
	const appointment = await prisma_next.appointment.findUnique({
		where: {
			id,
		},

		include: {
			patient: true,
			doctor: true,
		},
	});

	return { appointment };
}
export default async function EditAppointmentPage({ params: { detail: id } }: Props) {
	const user = await getCurrentUser();

	const { appointment } = await getData(id);
	return <AppointDetails appointment={appointment} user={user} />;
}
