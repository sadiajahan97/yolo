import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Vision Platform - Login",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
