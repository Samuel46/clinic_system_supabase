import { deleteWorkDayAction } from "@actions/workdays.actions";
import { cn } from "@lib/utils";
import { DayOfWeek, WorkDay } from "@prisma/client";
import { Button } from "@ui/button";
import { FormDescription } from "@ui/form";
import { RHFTimePicker } from "@ui/hook-form";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { Icons } from "@ui/icons";
import { Label } from "@ui/label";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

interface WorkDayComponentProps {
  workdays: WorkDay[];
}

const WorkDayItems: React.FC<WorkDayComponentProps> = ({ workdays }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { refresh } = useRouter();

  const [isPending, startTransition] = useTransition();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workDays",
  });

  const handleAdd = () => {
    append({ day: "", startTime: "", endTime: "" });
  };

  const handleDelete = async (index: number) => {
    if (workdays[index]) {
      startTransition(() => {
        deleteWorkDayAction(workdays[index].id).then((result) => {
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
      <Label className="text-base/6 text-neutral-500">Work Days:</Label>

      <div className="border-t-2 border-dashed mt-6">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="item-container grid gap-x-3 gap-y-4 grid-cols-8 items-center border-b-2 border-dashed pb-2 pt-4"
          >
            <div className="col-span-7 grid grid-cols-3 w-full gap-x-3 gap-y-4">
              <Controller
                name={`workDays.${index}.day`}
                control={control}
                render={({ field }) => (
                  // TODO: Make this dynamic!!!!
                  <RHFSingleSelect
                    {...field}
                    name={field.name}
                    label="Day"
                    options={Object.values(DayOfWeek).map((day) => ({
                      value: day,
                      label: day.replace("_", " "),
                    }))}
                    onSelect={field.onChange}
                  />
                )}
              />
              <Controller
                name={`workDays.${index}.startTime`}
                control={control}
                render={({ field }) => (
                  <RHFTimePicker {...field} name={field.name} label="Start time" />
                )}
              />
              <Controller
                name={`workDays.${index}.endTime`}
                control={control}
                render={({ field }) => (
                  <RHFTimePicker {...field} name={field.name} label="End time" />
                )}
              />
            </div>

            <Button
              type="button"
              className="text-destructive hover:text-red-900"
              variant="ghost"
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
          className={cn(errors.workDays?.message && "bg-red-200", "my-4")}
          onClick={() => handleAdd()}
        >
          <Plus className="mr-2" /> Add Work Day
        </Button>
        {errors.workDays?.message && (
          <FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
            {errors.workDays.message as string}
          </FormDescription>
        )}
      </div>
    </div>
  );
};

export default WorkDayItems;
