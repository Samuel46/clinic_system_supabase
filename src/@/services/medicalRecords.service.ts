import prisma_next from "@lib/db";
import { MedicalRecord } from "@prisma/client";
import { CreateMedicalRecordInput, UpdateMedicalRecordInput } from "@schemas/medicalRecord.schemas";

export const createMedicalRecord = async (data: CreateMedicalRecordInput) => {
	return await prisma_next.$transaction(async (tx) => {
		const { treatments, ...medicalRecordData } = data;

		const medicalRecord = await tx.medicalRecord.create({
			data: {
				...medicalRecordData,
				treatments:
					treatments && treatments.length > 0
						? {
								connect: treatments.map((id) => ({ id })),
						  }
						: undefined,
			},
			include: {
				treatments: true, // Include treatments in the returned data
			},
		});

		return medicalRecord;
	});
};

export const getMedicalRecordById = async (id: string) => {
	const medicalRecord = await prisma_next.medicalRecord.findUnique({
		where: { id },
		include: {
			tenant: true,
			patient: true,
			doctor: true,
		},
	});

	return medicalRecord;
};

export const getMedicalRecordsByTenant = async (tenantId: string) => {
	const medicalRecords = await prisma_next.medicalRecord.findMany({
		where: { tenantId },
		include: {
			tenant: true,
			patient: true,
			doctor: true,
		},
	});

	return medicalRecords;
};

export const updateMedicalRecord = async (id: string, data: UpdateMedicalRecordInput): Promise<MedicalRecord | null> => {
	// Fetch the current medical record
	const currentRecord = await prisma_next.medicalRecord.findUnique({
		where: { id },
		include: { treatments: true },
	});

	if (!currentRecord) {
		return null; // Record not found
	}

	const { treatments, ...updateData } = data;

	// Check if there are any changes in the non-treatment fields
	const hasChanges = Object.keys(updateData).some(
		(key) => updateData[key as keyof typeof updateData] !== (currentRecord as any)[key]
	);

	// Check if there are changes in treatments
	const currentTreatmentIds = currentRecord.treatments.map((t) => t.id);
	const treatmentsChanged =
		treatments &&
		(treatments.length !== currentTreatmentIds.length || !treatments.every((id) => currentTreatmentIds.includes(id)));

	if (!hasChanges && !treatmentsChanged) {
		return currentRecord; // No changes, return the current record
	}

	// Proceed with update if there are changes
	return await prisma_next.medicalRecord.update({
		where: { id },
		data: {
			...updateData,
			treatments: treatmentsChanged
				? {
						set: [], // Clear existing connections
						connect: treatments.map((id) => ({ id })), // Connect new treatments
				  }
				: undefined,
		},
		include: {
			treatments: true, // Include treatments in the returned data
		},
	});
};

export const deleteMedicalRecord = async (id: string): Promise<MedicalRecord> => {
	return await prisma_next.medicalRecord.delete({ where: { id } });
};
