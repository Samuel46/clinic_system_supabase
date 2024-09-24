import { DefaultUser } from "next-auth";

import {
	AppointmentStatus,
	BillingStatus,
	InvitationStatus,
	MedicalCheckup,
	PaymentMethod,
	Permission,
	Prisma,
	Role,
	RolePermission,
	Treatment,
	TreatmentType,
} from "@prisma/client";

// Users
export interface SessionUser extends DefaultUser {
	id: string;
	tenantId: string;
	role: string;
	emailVerified?: Date | null;
	// phone?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserWithRoleAndTenant {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
	tenant: string;
	role: string;
}

// *************************
export interface FilterOption {
	value: string;
	label: string;
}

export interface FilterableColumn {
	id: string;
	title: string;
	options: FilterOption[];
}

export interface CreateRoleResponse {
	success: boolean;
	data: { role: Role; permissions: Permission[] } | null;
	msg: string;
}

export interface RoleWithPermissions {
	id: string;
	name: string;
	description: string;
	permissions: (RolePermission & { permission: Permission })[];
}

export type InvitationWithRoleAndTenant = Prisma.InvitationGetPayload<{
	include: {
		tenant: true;
		role: true;
	};
}>;

export type PatientWithTenant = Prisma.PatientGetPayload<{
	include: {
		tenant: true;
	};
}>;

export type AppointmentWithPatientAndDoctor = Prisma.AppointmentGetPayload<{
	include: {
		patient: true;
		doctor: true;
	};
}> | null;

export type AppointmentDataTable = {
	id: string;
	time: string;
	patient: string;
	doctor: string;
	reason: string;
	status: AppointmentStatus;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
};

export type PatientColumns = {
	id: string;
	name: string;
	email: string;
	phone: string;
	tenantName?: string;
	address: string;
	dateOfBirth: Date | null;
	medicalHistory: string | null;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
};

export type InvitationColumns = {
	id: string;
	email: string;
	token: string;
	expiresAt: Date;
	tenantName: string;
	status: InvitationStatus;
	roleName: string;
	createdAt: Date;
	updatedAt: Date;
};

export type MedicalRecordColumns = {
	id: string;
	patient: string;
	doctor: string;
	checkup: MedicalCheckup | null;
	treatment: Treatment[] | null;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
};

export type BillingColumns = {
	id: string;
	patientName: string;
	amount: number;
	status: BillingStatus;
	paymentMethod: PaymentMethod;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
	staff: string;
};

export type MedicationColumns = {
	id: string;
	tenantName: string;
	name: string;
	description: string | null;
	price: number;
	unit: string;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
};

export type InventoryColumns = {
	id: string;
	medicationName: string;
	tenantName: string;
	quantity: number;
	threshold: number;
	expirationDate: Date | null;
	location: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type PrescriptionColumns = {
	id: string;
	tenantName: string;
	patientName: string;
	doctorName: string;
	medicationName: string;
	dosage: string;
	frequency: string;
	duration: string;
	instructions?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type SaleColumns = {
	id: string;
	tenantName: string;
	userName: string;
	customerName: string | null;
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: string;
	createdAt: Date;
	updatedAt: Date;
};

export type SupplyColumns = {
	id: string;
	name: string;
	description: string | null;
	unitCost: number;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
};

export type ProcedureColumns = {
	id: string;
	name: string;
	description: string;
	steps: number;
	equipment: number;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
};

export type TreatmentColumns = {
	id: string;
	name: string;
	description: string;
	doctor: string;
	procedure: string;
	type: TreatmentType;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
};
