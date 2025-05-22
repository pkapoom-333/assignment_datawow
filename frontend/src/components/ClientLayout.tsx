"use client";

import { ReactNode } from "react";
import Navigation from "@/components/Navigation"; // หรือตำแหน่งที่ตี๋ใช้จริง

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <Navigation>{children}</Navigation>;
}
