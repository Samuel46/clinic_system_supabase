import { fDate } from "./formatTime";

// utils.ts
export const generateUniqueOptions = <T extends object, K extends keyof T>(
  data: T[],
  key: K
) => {
  const map = new Map<
    string,
    { value: string; label: string; count: number; id?: string }
  >();

  data
    .filter((item) => item[key] !== null && item[key] !== undefined) // Filter out items with null or undefined values
    .forEach((item) => {
      let value = item[key];

      // Check if the value is a Date object and format it using fDate
      let formattedValue: string;
      if (value instanceof Date) {
        formattedValue = fDate(value);
      } else {
        formattedValue = String(value);
      }

      if (!map.has(formattedValue)) {
        map.set(formattedValue, {
          value: formattedValue,
          label: formattedValue,
          count: 0,
          id: "id" in item ? (item as any).id : undefined, // Ensure id is accessed safely
        });
      }

      const entry = map.get(formattedValue)!;
      entry.count += 1;
    });

  return Array.from(map.values());
};

export const generateTitle = (key: string) => {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
};
