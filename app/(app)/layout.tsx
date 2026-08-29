'use client'

import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}