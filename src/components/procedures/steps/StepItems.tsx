import { deleteStepAction } from "@actions/procedures.action";
import { cn } from "@lib/utils";
import { ProcedureStep } from "@prisma/client";
import { Button } from "@ui/button";
import { FormDescription } from "@ui/form";
import { RHFInput } from "@ui/hook-form";
import { Icons } from "@ui/icons";
import { Label } from "@ui/label";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  steps: ProcedureStep[];
}

const StepItems: React.FC<Props> = ({ steps }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const { refresh } = useRouter();

  const [isPending, startTransition] = useTransition();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const handleAdd = () => {
    const nextStepNumber = fields.length
      ? Math.max(...watch("steps").map((field: ProcedureStep) => field.stepNumber)) + 1
      : 1;
    append({ stepNumber: nextStepNumber, description: "", duration: 30 });
  };

  const handleDelete = async (index: number) => {
    if (steps[index]) {
      startTransition(() => {
        deleteStepAction(steps[index].id).then((result) => {
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
      <Label className="text-base/6 text-neutral-500">Steps:</Label>

      <div className="border-t-2 border-dashed mt-6">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="item-container grid gap-x-3 gap-y-4 grid-cols-8 items-center border-b-2 border-dashed pb-2 pt-4"
          >
            <div className="col-span-7 grid grid-cols-3 w-full gap-x-3 gap-y-4">
              <Controller
                name={`steps.${index}.stepNumber`}
                control={control}
                render={({ field }) => (
                  <RHFInput
                    {...field}
                    name={field.name}
                    label="stepNumber"
                    type="number"
                  />
                )}
              />
              <Controller
                name={`steps.${index}.description`}
                control={control}
                render={({ field }) => (
                  <RHFInput {...field} name={field.name} label="Description" />
                )}
              />

              <Controller
                name={`steps.${index}.duration`}
                control={control}
                render={({ field }) => (
                  <RHFInput {...field} name={field.name} label="Duration" type="number" />
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
          className={cn(errors.steps?.message && "bg-red-200", "my-4")}
          onClick={() => handleAdd()}
        >
          <Plus className="mr-2 size-4" /> Add
        </Button>
        {errors.steps?.message && (
          <FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
            {errors.steps.message as string}
          </FormDescription>
        )}
      </div>
    </div>
  );
};

export default StepItems;
