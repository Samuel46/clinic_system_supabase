import { deleteDayOffAction } from "@actions/daysoff.action";
import { cn } from "@lib/utils";
import { DayOff } from "@prisma/client";
import { Button } from "@ui/button";
import { FormDescription } from "@ui/form";
import { RHFDatePicker, RHFInput } from "@ui/hook-form";
import { Icons } from "@ui/icons";
import { Label } from "@ui/label";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

interface DayOffComponentProps {
  dayoff: DayOff[];
}

const DayOffItems: React.FC<DayOffComponentProps> = ({ dayoff }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { refresh } = useRouter();

  const [isPending, startTransition] = useTransition();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "daysOff",
  });

  const handleAdd = () => {
    append({ name: "", date: "", reason: "" });
  };

  const handleDelete = async (index: number) => {
    if (dayoff[index]) {
      startTransition(() => {
        deleteDayOffAction(dayoff[index].id).then((result) => {
          if (result.success) {
            toast.success(result.msg);
            remove(index);
            // Refresh or redirect logic here
            refresh(); // or use router.push to navigate
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
      <Label className="text-base/6 text-neutral-500">Days Off:</Label>

      <div className="border-t-2 border-dashed mt-6">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="item-container grid gap-x-3 gap-y-4 grid-cols-8 items-center border-b-2 border-dashed pb-2 pt-4"
          >
            <div className="col-span-7 grid grid-cols-3 w-full gap-x-3 gap-y-4">
              <Controller
                name={`daysOff.${index}.name`}
                control={control}
                render={({ field }) => (
                  <RHFInput {...field} name={field.name} label="Name" type="text" />
                )}
              />
              <Controller
                name={`daysOff.${index}.date`}
                control={control}
                render={({ field }) => (
                  <RHFDatePicker {...field} name={field.name} label="Date" />
                )}
              />
              <Controller
                name={`daysOff.${index}.reason`}
                control={control}
                render={({ field }) => (
                  <RHFInput {...field} name={field.name} label="Reason" type="text" />
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
          variant="secondary"
          className={cn(errors.daysOff?.message && "bg-red-200", "my-4")}
          onClick={() => handleAdd()}
        >
          <Plus className="mr-2" /> Add Day Off
        </Button>
        {errors.daysOff?.message && (
          <FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
            {errors.daysOff.message as string}
          </FormDescription>
        )}
      </div>
    </div>
  );
};

export default DayOffItems;
