"use client";

import { SessionUser } from "@type/index";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/* eslint-disable react/no-unescaped-entities */
// import { Icons } from "@ui/icons";

type Props = {
  user: SessionUser | undefined;
};

export default function AuthForbidden({ user }: Props) {
  console.log(user, "user");
  return (
    <div className=" h-screen">
      <div className="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] bg-white lg:grid-cols-[max(50%,36rem),1fr]">
        <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
          {/* <Icons.logo className=" h-20 w-25" /> */}
        </header>
        <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
          <div className="max-w-lg">
            <p className="text-base font-semibold leading-8 text-black">403 Forbidden</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Oops! You don't have access to this page.
            </h1>
            {/* <p className="mt-6 text-base leading-7 text-gray-600">
              {user?.status === "BANNED"
                ? "Your account has been deactivated by the administrator. Please contact them. You will be signed out in 10 second."
                : "It looks like you might have taken a wrong turn or don't have the necessary permissions to view this content."}
            </p> */}
            <div className="mt-10">
              <Link href="/" className="text-sm font-semibold leading-7 text-black">
                <span aria-hidden="true">&larr;</span> Back to home
              </Link>
            </div>
          </div>
        </main>
        <footer className="self-end lg:col-span-2 lg:col-start-1 lg:row-start-3">
          <div className="border-t border-gray-100 bg-gray-50 py-10">
            <nav className="mx-auto flex w-full max-w-7xl items-center gap-x-4 px-6 text-sm leading-7 text-gray-600 lg:px-8">
              <Link href="mailto:onboarding@vpv.solar">Contact support</Link>
              <svg
                viewBox="0 0 2 2"
                aria-hidden="true"
                className="h-0.5 w-0.5 fill-gray-300"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <Link href="/">Home</Link>
            </nav>
          </div>
        </footer>
        <div className="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
          <Image
            width={800}
            height={600}
            src="https://images.unsplash.com/photo-1470847355775-e0e3c35a9a2c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1825&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
