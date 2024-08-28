import AuthForgotForm from "@/components/auth/AuthForgotForm";
import { ChevronLeft } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-gray-500x relative h-screen  w-full lg:grid  lg:grid-cols-2 ">
      <div className="flex items-center justify-center  py-12">
        <div className="mx-auto grid w-[450px] gap-6">
          <div className="grid gap-2 ">
            <h1 className="font-display text-3xl font-bold text-left">
              Forgot your password?
            </h1>
            <p className="text-pretty font-display text-gray-600">
              Please enter the email address associated with your account and We will
              email you a link to reset your password.
            </p>
          </div>

          <AuthForgotForm />

          <div className="mt-4 text-center text-md">
            <Link
              href="/auth/login"
              className="underline underline-offset-2 flex gap-x-2 items-center justify-center  font-[500]"
            >
              <ChevronLeft /> Return to sign in
            </Link>
          </div>
        </div>
      </div>
      <div className=" relative hidden bg-gray-50/80 lg:block">
        <Image
          src="https://assets.lummi.ai/assets/QmawViViHNmynsAm2Ui4KdvkzmCGpfHZe1GvdAzSsGed33?auto=format&w=1500"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover  "
        />
      </div>
    </div>
  );
}
