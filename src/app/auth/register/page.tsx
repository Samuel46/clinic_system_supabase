import { AuthRegisterForm } from "@/components/auth";
import prisma_next from "@lib/db";
import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    token: string;
  };
}

async function getData(token: string) {
  const invitation = await prisma_next.invitation.findUnique({
    where: {
      token,
    },
  });

  return { invitation };
}

export default async function RegisterPage({ searchParams: { token } }: Props) {
  const { invitation } = await getData(token);

  if (!token) {
    redirect("/forbidden");
  }

  return (
    <div className="bg-gray-500x relative h-screen  w-full lg:grid  lg:grid-cols-2  place-content-center sm:place-content-stretch  ">
      <div className="flex items-center justify-center  py-12">
        <div className="mx-auto grid w-full max-w-[650px]  gap-6  container   ">
          <div className="grid gap-2 text-center">
            <h1 className="font-display text-3xl font-bold ">Create Account</h1>
            <p className="text-pretty font-display text-gray-600">
              Enter details below to create your account
            </p>
          </div>

          <AuthRegisterForm invitation={invitation} />

          <div className="mt-4 text-center font-display text-sm text-gray-700">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Sign in
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
