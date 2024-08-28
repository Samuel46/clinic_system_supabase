"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { RHFInput } from "@ui/hook-form";
import FormProvider from "@ui/hook-form/FormProvider";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@ui/icons";

import { ResetPasswordInput, resetPasswordSchema } from "@schemas/auth.schemas";
import { Button } from "@ui/button";
import { resetPasswordAction } from "@actions/users.action";
import Alert from "@ui/alert";

type Props = {
  token: string;
  email: string;
};
export default function AuthRestForm({ token, email }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [msgError, setMsgError] = useState<string>("");

  const defaultValues = {
    token,
    newPassword: "",
    confirmPassword: "",
    email,
  };

  const methods = useForm<ResetPasswordInput>({
    defaultValues,
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setIsLoading(true);

      const result = await resetPasswordAction(data.token, data.newPassword);

      if (result.success) {
        // Show success notification
        toast.success(result.msg);
        setMsg(result.msg);

        // Login the user
        signIn("credentials", {
          email: data.email,
          password: data.newPassword,
          redirect: false,
        }).then((callback) => {
          setIsLoading(false);

          console.log(callback, "callback");

          if (callback?.ok) {
            toast.success(`Logged in, Welcome back!`);
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
        setMsgError(result.msg);
      }
    } catch (error) {
      reset();
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <>
      {msg && <Alert message={msg} type="success" />}
      {msgError && <Alert message={msgError} type="error" />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <RHFInput
              label="New Password"
              name="newPassword"
              id="newPassword"
              type="password"
            />
          </div>

          <div className="grid gap-2">
            <RHFInput
              label="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              type="password"
            />
          </div>

          <Button disabled={isLoading} type="submit" className="w-full font-bold py-6">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </div>
      </FormProvider>
    </>
  );
}
