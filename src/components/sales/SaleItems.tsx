import React, { useEffect, useCallback } from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@ui/button";
import { Medication, SaleItem } from "@prisma/client";
import { RHFInput } from "@ui/hook-form";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { Plus, X } from "lucide-react";

import { FormDescription } from "@ui/form";
import { cn } from "@lib/utils";
import { Label } from "@ui/label";

interface SaleItemComponentProps {
  medications: Medication[];
}

const SaleItems: React.FC<SaleItemComponentProps> = ({ medications }) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  console.log(errors.items?.message, "er");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const values = watch();

  const handleAdd = () => {
    append({ medicationId: "", quantity: 1, price: 0 });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const totalOnRow = values.items.map(
    (item: SaleItem) => item.quantity * item.price
  ) as Array<number>;
  const totalAmount = totalOnRow.reduce((acc, curr) => acc + curr, 0);

  useEffect(() => {
    setValue("totalAmount", totalAmount);
    if (values.cashReceived) {
      const change = values.cashReceived - totalAmount;
      setValue("change", change);
    }
  }, [values.items, setValue, totalAmount, values.cashReceived]);

  const handleSelectService = useCallback(
    (index: number, value: string) => {
      setValue(
        `items.${index}.price`,
        medications.find((med) => med.id === value)?.price || 0
      );
    },
    [setValue, medications]
  );

  return (
    <div className="mt-1">
      <Label className=" text-base/6 text-neutral-500">Items:</Label>

      <div className="border-t-2 border-dashed mt-6">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="item-container grid gap-x-3 gap-y-4 grid-cols-8 items-center   border-b-2 border-dashed pb-2 pt-4 "
          >
            <div className=" col-span-7 grid grid-cols-3 w-full gap-x-3 gap-y-4">
              <Controller
                name={`items.${index}.medicationId`}
                control={control}
                render={({ field: medicationField }) => (
                  <RHFSingleSelect
                    name={medicationField.name}
                    label="Medication"
                    options={medications.map((med) => ({
                      value: med.id,
                      label: med.name,
                    }))}
                    onSelect={(value) => {
                      medicationField.onChange(value);
                      handleSelectService(index, value);
                    }}
                  />
                )}
              />
              <Controller
                name={`items.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <RHFInput
                    {...field}
                    name={field.name}
                    label="Quantity"
                    type="number"
                    onChange={(e) => {
                      field.onChange(e);
                      const selectedMedication = medications.find(
                        (med) => med.id === field.value
                      );
                      if (selectedMedication) {
                        setValue(`items.${index}.price`, selectedMedication.price);
                      }
                    }}
                  />
                )}
              />
              <Controller
                name={`items.${index}.price`}
                control={control}
                render={({ field }) => (
                  <RHFInput
                    {...field}
                    name={field.name}
                    label="Price"
                    type="number"
                    disabled
                  />
                )}
              />
            </div>

            <Button
              type="button"
              className="  text-destructive hover:text-red-900  "
              variant="ghost"
              onClick={() => handleRemove(index)}
            >
              <X className="mr-2  " /> Remove
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          className={cn(errors.items?.message && "bg-red-200", "my-4")}
          onClick={() => handleAdd()}
        >
          <Plus className="mr-2  " /> Add Item
        </Button>
        {errors.items?.message && (
          <FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
            {errors.items.message as string}
          </FormDescription>
        )}
      </div>
    </div>
  );
};

export default SaleItems;
