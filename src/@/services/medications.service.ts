import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { MedicationUnit } from "@prisma/client";
import {
  CreateMedicationInput,
  UpdateMedicationInput,
} from "@schemas/medications.schemas";

export const createMedication = async (data: CreateMedicationInput) => {
  return await prisma_next.medication.create({
    data,
  });
};

export const updateMedication = async (id: string, data: UpdateMedicationInput) => {
  return await prisma_next.medication.update({
    where: { id },
    data,
  });
};

export const getMedicationById = async (id: string) => {
  return await prisma_next.medication.findUnique({
    where: { id },
  });
};

export const getAllMedications = async (tenantId: string) => {
  return await prisma_next.medication.findMany({
    where: { tenantId },
  });
};

export const deleteMedication = async (id: string) => {
  return await prisma_next.medication.delete({
    where: { id },
  });
};

export async function createSampleMedications() {
  const user = await getCurrentUser();
  const medications = [
    {
      name: "Paracetamol",
      description: "Pain reliever and a fever reducer",
      price: 5.99,
      unit: MedicationUnit.PILLS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Amoxicillin",
      description: "Antibiotic used to treat bacterial infections",
      price: 12.99,
      unit: MedicationUnit.CAPSULES,
      tenantId: user?.tenantId!,
    },
    {
      name: "Cough Syrup",
      description: "Relieves cough and throat irritation",
      price: 8.49,
      unit: MedicationUnit.BOTTLES,
      tenantId: user?.tenantId!,
    },
    {
      name: "Vitamin D",
      description: "Supplement for vitamin D deficiency",
      price: 15.0,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Insulin",
      description: "Used to control blood sugar in diabetes",
      price: 50.0,
      unit: MedicationUnit.VIALS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Antibiotic Ointment",
      description: "Used for skin infections and minor cuts",
      price: 7.25,
      unit: MedicationUnit.TUBES,
      tenantId: user?.tenantId!,
    },
    {
      name: "Ibuprofen",
      description: "Nonsteroidal anti-inflammatory drug (NSAID) used for pain relief",
      price: 9.99,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Loratadine",
      description: "Antihistamine used to treat allergies",
      price: 11.99,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Hydrocortisone Cream",
      description: "Cream used to reduce skin inflammation",
      price: 6.5,
      unit: MedicationUnit.TUBES,
      tenantId: user?.tenantId!,
    },
    {
      name: "Prednisone",
      description: "Corticosteroid used to treat inflammatory conditions",
      price: 18.75,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Metformin",
      description: "Medication used to control blood sugar in type 2 diabetes",
      price: 13.0,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Aspirin",
      description: "Pain reliever, anti-inflammatory, and blood thinner",
      price: 5.5,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Omeprazole",
      description: "Proton pump inhibitor used to treat acid reflux",
      price: 14.0,
      unit: MedicationUnit.CAPSULES,
      tenantId: user?.tenantId!,
    },
    {
      name: "Albuterol Inhaler",
      description: "Bronchodilator used to treat asthma",
      price: 25.0,
      unit: MedicationUnit.PUFFS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Simvastatin",
      description: "Statin used to control high cholesterol",
      price: 19.99,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Ciprofloxacin",
      description: "Antibiotic used to treat bacterial infections",
      price: 22.5,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Furosemide",
      description: "Diuretic used to treat fluid retention (edema)",
      price: 10.0,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Clotrimazole Cream",
      description: "Antifungal cream used to treat skin infections",
      price: 8.0,
      unit: MedicationUnit.TUBES,
      tenantId: user?.tenantId!,
    },
    {
      name: "Azithromycin",
      description: "Antibiotic used to treat various infections",
      price: 20.0,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Levothyroxine",
      description: "Medication used to treat hypothyroidism",
      price: 12.5,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Gabapentin",
      description: "Medication used to treat nerve pain and seizures",
      price: 16.75,
      unit: MedicationUnit.CAPSULES,
      tenantId: user?.tenantId!,
    },
    {
      name: "Fluticasone Nasal Spray",
      description: "Nasal spray used to treat allergic rhinitis",
      price: 14.99,
      unit: MedicationUnit.SPRAY,
      tenantId: user?.tenantId!,
    },
    {
      name: "Zinc Tablets",
      description: "Supplement used to prevent or treat zinc deficiency",
      price: 5.0,
      unit: MedicationUnit.TABLETS,
      tenantId: user?.tenantId!,
    },
    {
      name: "Cough Drops",
      description: "Used to soothe sore throats and reduce coughing",
      price: 4.5,
      unit: MedicationUnit.SACHETS,
      tenantId: user?.tenantId!,
    },
  ];

  const createdMedications = await prisma_next.medication.createMany({
    data: medications,
  });

  return createMedication;
}

export async function fetchTopSellingMedication(): Promise<{
  medication: string;
  totalQuantity: number;
  percentageChange: number;
}> {
  return await prisma_next.$transaction(async (tx) => {
    const now = new Date();
    const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    const topSellingCurrentWeek = await tx.saleItem.groupBy({
      by: ["medicationId"],
      _sum: {
        quantity: true,
      },
      where: {
        createdAt: {
          gte: currentWeekStart,
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 1,
    });

    if (topSellingCurrentWeek.length === 0) {
      return { medication: "None", totalQuantity: 0, percentageChange: 0 };
    }

    const medication = await tx.medication.findUnique({
      where: { id: topSellingCurrentWeek[0].medicationId },
    });

    if (!medication) {
      return { medication: "Unknown", totalQuantity: 0, percentageChange: 0 };
    }

    const currentWeekQuantity = topSellingCurrentWeek[0]._sum.quantity ?? 0;

    const previousWeekQuantityData = await tx.saleItem.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        medicationId: topSellingCurrentWeek[0].medicationId,
        createdAt: {
          gte: previousWeekStart,
          lt: currentWeekStart,
        },
      },
    });

    const previousWeekQuantity = previousWeekQuantityData._sum.quantity ?? 0;
    const percentageChange = previousWeekQuantity
      ? ((currentWeekQuantity - previousWeekQuantity) / previousWeekQuantity) * 100
      : currentWeekQuantity > 0
      ? 100
      : 0;

    return {
      medication: medication.name,
      totalQuantity: currentWeekQuantity,
      percentageChange,
    };
  });
}
