import { MedicationUnit } from "@prisma/client";
import { z } from "zod";

export const createMedicationSchema = z.object({
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  price: z.number().positive({ message: "Price must be a positive number" }),
  unit: z.nativeEnum(MedicationUnit, {
    errorMap: () => ({ message: "Unit is required" }),
  }),
});

export const updateMedicationSchema = createMedicationSchema.partial();

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;

export const unitOptions = [
  {
    value: MedicationUnit.PILLS,
    label: MedicationUnit.PILLS,
  },
  {
    value: MedicationUnit.TABLETS,
    label: MedicationUnit.TABLETS,
  },
  {
    value: MedicationUnit.CAPSULES,
    label: MedicationUnit.CAPSULES,
  },
  {
    value: MedicationUnit.BOTTLES,
    label: MedicationUnit.BOTTLES,
  },
  {
    value: MedicationUnit.VIALS,
    label: MedicationUnit.VIALS,
  },
  {
    value: MedicationUnit.AMPOULES,
    label: MedicationUnit.AMPOULES,
  },
  {
    value: MedicationUnit.BOXES,
    label: MedicationUnit.BOXES,
  },
  {
    value: MedicationUnit.SACHETS,
    label: MedicationUnit.SACHETS,
  },
  {
    value: MedicationUnit.BLISTERS,
    label: MedicationUnit.BLISTERS,
  },
  {
    value: MedicationUnit.MILLILITERS,
    label: MedicationUnit.MILLILITERS,
  },
  {
    value: MedicationUnit.GRAMS,
    label: MedicationUnit.GRAMS,
  },
  {
    value: MedicationUnit.MICROGRAMS,
    label: MedicationUnit.MICROGRAMS,
  },
  {
    value: MedicationUnit.LITERS,
    label: MedicationUnit.LITERS,
  },
  {
    value: MedicationUnit.TEASPOONS,
    label: MedicationUnit.TEASPOONS,
  },
  {
    value: MedicationUnit.TABLESPOONS,
    label: MedicationUnit.TABLESPOONS,
  },
  {
    value: MedicationUnit.OZ,
    label: MedicationUnit.OZ,
  },
  {
    value: MedicationUnit.IU,
    label: MedicationUnit.IU,
  },
  {
    value: MedicationUnit.PUFFS,
    label: MedicationUnit.PUFFS,
  },
  {
    value: MedicationUnit.PACKS,
    label: MedicationUnit.PACKS,
  },
  {
    value: MedicationUnit.TUBES,
    label: MedicationUnit.TUBES,
  },
  {
    value: MedicationUnit.PATCHES,
    label: MedicationUnit.PATCHES,
  },
  {
    value: MedicationUnit.KITS,
    label: MedicationUnit.KITS,
  },
];
