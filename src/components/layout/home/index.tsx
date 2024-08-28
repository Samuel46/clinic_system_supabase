"use client";

import { ToasterProvider } from "../../../providers";

type Props = {
  children: React.ReactNode;
};
export function HomeLayout({ children }: Props) {
  return (
    <div className="w-full h-full">
      <ToasterProvider />
      {children}
    </div>
  );
}
