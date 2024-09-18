import { deleteTreatmentEquipmentAction } from "@actions/treatment.action";
import { cn } from "@lib/utils";
import { Component, ProcedureEquipment, TreatmentComponent } from "@prisma/client";
import { Button } from "@ui/button";
import { FormDescription } from "@ui/form";
import { RHFInput } from "@ui/hook-form";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { Icons } from "@ui/icons";
import { Label } from "@ui/label";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  equipments: TreatmentComponent[];
  supplies: Component[];
}

const EquipmentItems: React.FC<Props> = ({ equipments, supplies }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { refresh } = useRouter();

  const [isPending, startTransition] = useTransition();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "treatmentEquipments",
  });

  const handleAdd = () => {
    append({ componentId: "", quantity: 1 });
  };

  const handleDelete = async (index: number) => {
    if (equipments[index]) {
      startTransition(() => {
        deleteTreatmentEquipmentAction(equipments[index].id).then((result) => {
          if (result.success) {
            toast.success(result.msg);
            remove(index);
            // Refresh or redirect logic here
            refresh();
          } else {
            toast.error(result.msg);
          }
        });

        refresh();
      });
    } else {
      remove(index);
    }
  };

  return (
    <div className="mt-1">
      <Label className="text-base/6 text-neutral-500">Equipment:</Label>

      <div className="border-t-2 border-dashed mt-6">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="item-container grid gap-x-3 gap-y-4 grid-cols-8 items-center border-b-2 border-dashed pb-2 pt-4"
          >
            <div className="col-span-7 grid grid-cols-2 w-full gap-x-3 gap-y-4">
              <Controller
                name={`treatmentEquipments.${index}.componentId`}
                control={control}
                render={({ field }) => (
                  <RHFSingleSelect
                    name={field.name}
                    label="Equipment"
                    options={supplies.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                  />
                )}
              />

              <Controller
                name={`treatmentEquipments.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <RHFInput {...field} name={field.name} label="Quantity" type="number" />
                )}
              />
            </div>

            <Button
              type="button"
              className="text-destructive hover:text-red-900"
              variant="ghost"
              disabled={isPending}
              onClick={() => handleDelete(index)}
            >
              {isPending && <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />}
              {!isPending && <X className="mr-2 h-5" />} Remove
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className={cn(errors.equipment?.message && "bg-red-200", "my-4")}
          onClick={() => handleAdd()}
        >
          <Plus className="mr-2 size-4" /> Add
        </Button>
        {errors.equipment?.message && (
          <FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
            {errors.equipment.message as string}
          </FormDescription>
        )}
      </div>
    </div>
  );
};

export default EquipmentItems;
