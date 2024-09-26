import type { Metadata } from "next";
import { Inter, Poppins, Work_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const works_sans = Poppins({
  weight: ["400", "600", "500", "700"], // Specify weights as needed
  style: ["normal"], // Specify styles as needed
  subsets: ["latin"], // Specify subsets as needed
  display: "swap", // Optional; for font display strategy
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full text-base antialiased">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={works_sans.className}>{children}</body>
    </html>
  );
}
