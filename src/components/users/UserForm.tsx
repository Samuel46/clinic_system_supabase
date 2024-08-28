"use client";
import { updateUserAction } from "@actions/users.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { UpdateUserInput, updateUserSchema } from "@schemas/auth.schemas";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import FormProvider, { RHFInput } from "@ui/hook-form";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { Icons } from "@ui/icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";

type Props = {
  user?: SessionUser;
  currentUser?: User | null;
  edit?: boolean;
  roleOptions: Array<{ value: string; label: string }>;
};
export default function UserForm({
  user,
  currentUser,
  edit = false,
  roleOptions,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: currentUser?.tenantId || user?.tenantId || "",
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      roleId: currentUser?.roleId || "",
    }),
    [currentUser, user]
  );

  const methods = useForm<UpdateUserInput>({
    defaultValues,
    resolver: zodResolver(updateUserSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit: SubmitHandler<UpdateUserInput> = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      let result;

      if (edit && currentUser) {
        const hasChanges = !(
          currentUser.tenantId === data.tenantId &&
          currentUser.name === data.name &&
          currentUser.email === data.email &&
          currentUser.roleId === data.roleId
        );

        if (hasChanges) {
          result = await updateUserAction(currentUser.id, data);
        } else {
          toast.info("No changes detected");
          return;
        }
      }

      if (result?.success) {
        toast.success(result.msg);
        router.back();
        reset();
      } else {
        toast.error(result?.msg ?? "");
        setError(result?.msg ?? "");
      }
    } catch (error) {
      console.error("Failed to submit user form:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <FadeIn className=" space-y-6 pt-10">
      <DynamicBreadcrumb />
      <div className="flex w-full flex-wrap items-end justify-between gap-4   dark:border-white/10">
        <Heading className=" font-display pb-4">
          {edit ? "Update user" : "Add user"}
        </Heading>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <RHFInput name="name" id="name" label="Full Name" placeholder="John" />
          </div>
          <div className="grid gap-2">
            <RHFInput
              name="email"
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              disabled
            />
          </div>

          <div className="grid gap-2">
            <RHFSingleSelect name="roleId" options={roleOptions} label="Role" />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="py-6  place-self-start font-bold  items-center"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update user" : "Create user"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
