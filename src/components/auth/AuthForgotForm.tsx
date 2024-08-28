"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { RHFInput } from "@ui/hook-form";
import FormProvider from "@ui/hook-form/FormProvider";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@ui/icons";

import { ForgotPasswordInput, forgotPasswordSchema } from "@schemas/auth.schemas";
import { Button } from "@ui/button";
import { forgotPasswordAction } from "@actions/users.action";
import Alert from "@ui/alert";

export default function AuthForgotForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [msgError, setMsgError] = useState<string>("");

  const defaultValues = {
    email: "",
  };

  const methods = useForm<ForgotPasswordInput>({
    defaultValues,
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setMsg("");
      setMsgError("");
      setIsLoading(true);
      const result = await forgotPasswordAction(data.email);

      if (result.success) {
        // Show success notification
        toast.success(result.msg);
        setMsg(result.msg);
        // Reset the form
        reset();
      } else {
        // Show error notification
        toast.error(result.msg);
        setMsgError(result.msg);
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
    <>
      {msg && <Alert message={msg} type="success" />}
      {msgError && <Alert message={msgError} type="error" />}

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <RHFInput
              name="email"
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
            />
          </div>

          <Button disabled={isLoading} type="submit" className="w-full py-6 font-bold">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </FormProvider>
    </>
  );
}
