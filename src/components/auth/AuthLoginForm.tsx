"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { RHFInput } from "@ui/hook-form";
import FormProvider from "@ui/hook-form/FormProvider";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@ui/icons";

import { CreateSessionInput, createSessionSchema } from "@schemas/auth.schemas";
import { Button } from "@ui/button";

export default function AuthLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm<CreateSessionInput & { notes: string }>({
    defaultValues,
    resolver: zodResolver(createSessionSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: CreateSessionInput) => {
    try {
      setIsLoading(true);

      signIn("credentials", {
        ...data,
        redirect: false,
      }).then((callback) => {
        setIsLoading(false);

        console.log(callback, "callback");

        reset();

        if (callback?.ok) {
          toast.success(`Logged in, Welcome back!`);
          router.refresh();
          router.push("/admin");
        }

        if (callback?.error) {
          toast.error(callback.error);
        }
      });
    } catch (error) {
      reset();
    }
  };
  return (
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
        <div className="flex items-center">
          <Link
            href="/auth/forgot-password"
            className="ml-auto inline-block font-display text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="grid gap-2">
          <RHFInput label="Password" name="password" id="password" type="password" />
        </div>

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </FormProvider>
  );
}
