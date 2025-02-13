"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";
import FormProvider from "@ui/hook-form/FormProvider";
import { RHFInput } from "@ui/hook-form";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { Prisma, Role, Tenant } from "@prisma/client";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import {
  CreateInvitationInput,
  createInvitationSchema,
} from "@schemas/invitation.schemas";
import {
  createInvitationAction,
  updateInvitationAction,
} from "@actions/invitations.action";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import ScheduleProgress from "../schedules/scheduleProgress";
import { ChevronRight } from "lucide-react";

type Props = {
  edit?: boolean;
  currentInvitation?: Prisma.InvitationGetPayload<{
    include: {
      schedule: {
        include: {
          daysOff: true;
          workDays: true;
        };
      };
    };
  }> | null;
  tenants: Tenant[];
  roles: Role[];
};
export default function InvitationForm({
  edit,
  currentInvitation,
  tenants,
  roles,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const defaultValues: CreateInvitationInput = useMemo(
    () => ({
      email: currentInvitation?.email || "",
      tenantId: currentInvitation?.tenantId || "",
      roleId: currentInvitation?.roleId || "", // Ensure this is dynamically set or selected in your form
    }),
    [currentInvitation]
  );

  const methods = useForm<CreateInvitationInput>({
    defaultValues,
    resolver: zodResolver(createInvitationSchema),
  });

  const tenantOptions = tenants.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const roleOptions = roles.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const { handleSubmit, reset, watch } = methods;

  const userInput = watch();

  const hasChanges =
    userInput.email !== currentInvitation?.email ||
    userInput.tenantId !== currentInvitation?.tenantId ||
    userInput.roleId !== currentInvitation?.roleId;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentInvitation]);

  const onSubmit: SubmitHandler<CreateInvitationInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      // Determine if we are in edit mode and if there are any changes
      if (edit && currentInvitation) {
        if (hasChanges) {
          result = await updateInvitationAction(currentInvitation.id, data);
        } else {
          toast.info("No changes detected");
          return;
        }
      } else {
        // Call the create invitation action with form data
        result = await createInvitationAction(data);
      }

      if (result.success) {
        // Show success notification
        toast.success(result.msg);
        if (!currentInvitation) {
          router.push(`/admin/users/invitations/workdays?id=${result.data?.scheduleId}`);
        }

        // Reset the form
        reset();
      } else {
        // Show error notification
        toast.error(result.msg);
      }
    } catch (error) {
      console.error("Failed to submit invitation:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <FadeIn className=" space-y-6  grid">
      <DynamicBreadcrumb />
      <ScheduleProgress
        currentInvitation={Boolean(currentInvitation)}
        currentDayOff={Boolean(currentInvitation?.schedule?.daysOff.length)}
        currentWorkDay={Boolean(currentInvitation?.schedule?.workDays.length)}
        id={currentInvitation?.scheduleId ?? ""}
      />

      <div className="flex w-full flex-wrap items-center justify-between gap-4  dark:border-white/10">
        <Heading className=" font-display ">
          {edit ? "Update invitation" : "Add invitation"}
        </Heading>
      </div>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 w-full">
          <div className="grid gap-2">
            <RHFSingleSelect
              name="tenantId"
              label="Select tenant"
              options={tenantOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RHFSingleSelect name="roleId" label="Select Role" options={roleOptions} />

            <RHFInput name="email" label="Email Address" />
          </div>

          <Button
            variant={currentInvitation && !hasChanges ? "secondary" : "default"}
            disabled={isLoading}
            type="submit"
            className=" place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update invitation" : "Create invitation"}
          </Button>
        </div>
      </FormProvider>

      {currentInvitation && (
        <Button
          type="submit"
          disabled={hasChanges}
          onClick={() =>
            startTransition(() =>
              router.push(
                `/admin/users/invitations/workdays?id=${currentInvitation?.scheduleId}`
              )
            )
          }
          className="place-self-end"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
          <ChevronRight className=" size-5" />
        </Button>
      )}
    </FadeIn>
  );
}
