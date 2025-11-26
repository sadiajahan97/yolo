import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Vision Platform - Dashboard",
};

export default function YoloLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
