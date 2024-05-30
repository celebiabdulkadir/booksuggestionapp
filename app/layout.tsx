import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Loading from "./loading";
import { Suspense } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Book Suggestion App",
  description: "Generated by OPENAI and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense fallback={<Loading />}>
        <body className={poppins.className}>{children}</body>
      </Suspense>
      
    </html>
  );
}
