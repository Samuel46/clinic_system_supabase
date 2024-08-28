import { AuthLoginForm } from "@/components/auth";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-gray-500x relative h-screen  w-full lg:grid  lg:grid-cols-2 ">
      <div className="flex items-center justify-center  py-12">
        <div className="mx-auto grid w-[450px] gap-6">
          <div className="grid gap-2 ">
            <h1 className="font-display text-3xl font-bold text-left">Login</h1>
            <p className="text-pretty font-display text-gray-600">
              Enter your email below to login to your account
            </p>
          </div>

          <AuthLoginForm />
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
