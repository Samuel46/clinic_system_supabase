"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { RHFInput } from "@ui/hook-form";
import FormProvider from "@ui/hook-form/FormProvider";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@ui/icons";

import { CreateUserInput, createUserSchema } from "@schemas/auth.schemas";
import { Button } from "@ui/button";
import { Invitation } from "@prisma/client";
import { registerUserAction } from "@actions/users.action";

type Props = {
  invitation: Invitation | null;
};
export default function AuthRegisterForm({ invitation }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues = useMemo(
    () => ({
      email: invitation?.email,
      password: "",
      name: "",
      tenantId: invitation?.tenantId,
      roleId: invitation?.roleId,
    }),
    [invitation?.email, invitation?.roleId, invitation?.tenantId]
  );

  const methods = useForm<CreateUserInput>({
    defaultValues,
    resolver: zodResolver(createUserSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  console.log(watch());

  useEffect(() => {
    reset({
      tenantId: invitation?.tenantId,
      roleId: invitation?.roleId,
      email: invitation?.email,
    });
  }, [defaultValues, reset, invitation]);

  const onSubmit = async (data: CreateUserInput) => {
    try {
      setIsLoading(true);
      const result = await registerUserAction(data, invitation?.token!);

      if (result.success) {
        // Show success notification
        toast.success(result.msg);
        // Reset the form

        signIn("credentials", {
          email: invitation?.email,
          password: data.password,

          redirect: false,
        }).then((callback) => {
          setIsLoading(false);

          console.log(callback, "callback");

          reset();

          if (callback?.ok) {
            toast.success(`Logged in, Welcome!`);
            router.refresh();
            router.push("/admin");
          }

          if (callback?.error) {
            toast.error(callback.error);
          }
        });
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
          <RHFInput label="Password" name="password" id="password" type="password" />
        </div>

        <Button
          disabled={isLoading || !invitation}
          type="submit"
          className=" font-bold p-6"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </div>
    </FormProvider>
  );
}
