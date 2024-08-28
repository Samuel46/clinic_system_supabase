"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRoleInput, createRoleSchema } from "@schemas/role.schemas";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";
import FormProvider from "@ui/hook-form/FormProvider";
import { RHFInput } from "@ui/hook-form";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { PermissionAction } from "@prisma/client";
import RHFMultiSelect from "@ui/hook-form/RHFMultiSelect";

import { toast } from "sonner";
import { createRoleAction, updateRoleAction } from "@actions/roles.action";

import { RoleWithPermissions } from "@type/index";
import { useRouter } from "next/navigation";
import { createPermissionsAction } from "@actions/permissions.action";

type Props = {
  edit?: boolean;
  currentRole?: RoleWithPermissions | null;
};
export default function RoleForm({ edit, currentRole }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const defaultValues: CreateRoleInput = useMemo(
    () => ({
      description: currentRole?.description || "",
      name: currentRole?.name || "",
      permissions: currentRole?.permissions.map((perm) => perm.permission.action) || [],
    }),
    [currentRole]
  );

  const methods = useForm<CreateRoleInput>({
    defaultValues,
    resolver: zodResolver(createRoleSchema),
  });
  const permissionOptions = Object.values(PermissionAction).map((action) => ({
    value: action,
    label: action.replace(/_/g, " "),
  }));

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentRole, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateRoleInput> = async (data) => {
    try {
      setIsLoading(true);

      if (edit && currentRole) {
        const hasChanges =
          data.name !== currentRole.name ||
          data.description !== currentRole.description ||
          data.permissions.sort().join() !==
            currentRole.permissions
              .map((p) => p.permission.action)
              .sort()
              .join();

        if (!hasChanges) {
          toast.info("No changes detected");
          setIsLoading(false);
          return;
        }
      }

      let result;
      if (edit && currentRole?.id) {
        result = await updateRoleAction(data, currentRole.id);
      } else {
        result = await createRoleAction(data.name, data.description, data.permissions);
      }

      if (result.success) {
        toast.success(result.msg);
        router.back();
        reset();
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const generatePermission = () => {
    startTransition(async () => {
      const result = await createPermissionsAction();
      if (result.success) {
        toast.success(result.msg);
        router.refresh();
      } else {
        toast.error(result.msg);
      }
    });
  };

  return (
    <FadeIn className=" space-y-3 pt-10">
      <DynamicBreadcrumb />
      <div className="flex w-full flex-wrap items-center justify-between gap-4  pb-6 dark:border-white/10">
        <Heading className=" font-display pb-4">
          {edit ? "Update role" : "Add role"}
        </Heading>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={generatePermission}>
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}Generate
            Permissions
          </Button>
        </div>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <RHFInput name="name" label="Role Name" id="name" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <RHFMultiSelect
              name="permissions"
              label="Select Permissions"
              options={permissionOptions}
            />
            <RHFInput name="description" label="Description" />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="py-6  w-44 font-bold font-display items-center "
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
