// utils/equipmentUtils.ts

export const createEquipmentMap = (
  equipments: { id: string; name: string }[]
): Map<string, string> => {
  return new Map(equipments.map((item) => [item.id, item.name]));
};

export const mapCurrentEquipments = (
  currentEquipments: { equipmentId: string; quantity: number }[]
): Map<string, { equipmentId: string; quantity: number }> => {
  return new Map(currentEquipments.map((e) => [e.equipmentId, e]));
};

export function getNewInputs<T>(currentEquipments: T[], watchedEquipment: T[]): T[] {
  // Compare the lengths of currentEquipments and watchedEquipment
  const currentLength = currentEquipments.length;
  const newLength = watchedEquipment.length;

  // If watchedEquipment doesn't have more items, return an empty array (no new inputs)
  if (newLength <= currentLength) {
    return [];
  }

  // Slice the newly added items based on the difference in length
  const newInputs = watchedEquipment.slice(currentLength);

  // Return the newly added inputs
  return newInputs;
}
