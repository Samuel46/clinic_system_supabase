import type { Metadata } from "next";
import { ToasterProvider } from "../../providers";

export const metadata: Metadata = {
  title: "Auth pages",
  description: "Auth pages ......",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full text-base font-display antialiased">
      <body>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
