import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { removeTreatmentFromAppointmentAction } from "@actions/appointments.action";
import { cn } from "@lib/utils";
import { Treatment, TreatmentType } from "@prisma/client";
import { Button } from "@ui/button";
import { FormDescription } from "@ui/form";
import { RHFInput } from "@ui/hook-form";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { Icons } from "@ui/icons";
import { Label } from "@ui/label";

interface Props {
	treatment: Treatment[];
	appointmentId: string;
}

const TreatmentItems: React.FC<Props> = ({ treatment, appointmentId }) => {
	const {
		control,
		setValue,
		formState: { errors },
		watch,
	} = useFormContext();
	const { refresh } = useRouter();

	const [isPending, startTransition] = useTransition();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "treatment",
	});

	const handleAdd = () => {
		append({ id: "", description: "", type: "" });
	};

	const handleDelete = (index: number, item: Treatment) => {
		console.log(item, "item");
		const treatmentId = treatment.find((t) => t.name === item.name)?.id;

		if (treatmentId) {
			startTransition(() => {
				removeTreatmentFromAppointmentAction(appointmentId, treatmentId).then((res) => {
					if (res.success) {
						toast.success(res.msg);
						refresh();
						remove(index);
					} else {
						toast.error(res.msg);
					}
				});
			});
		} else {
			remove(index);
		}
	};

	// Watch all selected treatment IDs
	const selectedTreatmentIds = useWatch({
		control,
		name: (watch("treatment") as []).map((_, index) => `treatment.${index}.id`),
	});

	// UseEffect to update fields based on treatment id
	useEffect(() => {
		selectedTreatmentIds.forEach((selectedTreatmentId, index) => {
			const selectedTreatment = treatment.find((t) => t.id === selectedTreatmentId);

			if (selectedTreatment) {
				setValue(`treatment.${index}.description`, selectedTreatment.description);
				setValue(`treatment.${index}.type`, selectedTreatment.type);
				setValue(`treatment.${index}.tenantId`, selectedTreatment.tenantId);
				setValue(`treatment.${index}.doctorId`, selectedTreatment.doctorId);
				setValue(`treatment.${index}.name`, selectedTreatment.name);
			}
		});
	}, [selectedTreatmentIds, setValue, treatment]);

	return (
		<div className="mt-1">
			<Label className="text-base/6 text-neutral-500">Treatment:</Label>

			<div className="border-t-2 border-dashed mt-6">
				{fields.map((item, index) => {
					// Get the list of available treatments by filtering out selected IDs
					const availableTreatmentOptions = treatment
						.filter((item) => !selectedTreatmentIds.includes(item.id) || selectedTreatmentIds[index] === item.id)
						.map((item) => ({
							value: item.id,
							label: item.name,
						}));

					return (
						<div
							key={item.id}
							className="item-container grid gap-x-3 gap-y-4 grid-cols-8 items-center border-b-2 border-dashed pb-2 pt-4"
						>
							<div className="col-span-7 grid grid-cols-3 w-full gap-x-3 gap-y-4">
								<Controller
									name={`treatment.${index}.id`}
									control={control}
									render={({ field }) => (
										<RHFSingleSelect
											name={field.name}
											label="Treatment"
											options={availableTreatmentOptions}
											onSelect={(value) => field.onChange(value)} // update the selected value
										/>
									)}
								/>

								<Controller
									name={`treatment.${index}.description`}
									control={control}
									render={({ field }) => <RHFInput {...field} name={field.name} label="Description" />}
								/>
								<Controller
									name={`treatment.${index}.type`}
									control={control}
									render={({ field }) => (
										<RHFSingleSelect
											name={field.name}
											label="Treatment Type"
											options={Object.values(TreatmentType).map((type) => ({
												value: type,
												label: type.charAt(0) + type.slice(1).toLowerCase(),
											}))}
										/>
									)}
								/>
							</div>

							<Button
								type="button"
								className="text-destructive hover:text-red-900"
								variant="ghost"
								disabled={isPending}
								onClick={() => handleDelete(index, item as Treatment)}
							>
								{isPending && <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />}
								{!isPending && <X className="mr-2 h-5" />} Remove
							</Button>
						</div>
					);
				})}

				<Button
					type="button"
					variant="outline"
					className={cn(errors.treatment?.message && "bg-red-200", "my-4")}
					onClick={() => handleAdd()}
				>
					<Plus className="mr-2 size-4" /> Add
				</Button>
				{errors.treatment?.message && (
					<FormDescription className="text-wrap text-[0.8rem] font-medium text-red-600">
						{errors.treatment?.message as string}
					</FormDescription>
				)}
			</div>
		</div>
	);
};

export default TreatmentItems;
