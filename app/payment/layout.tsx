import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Payment",
  description: "Complete your course payment securely with Only Students.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return children;
}
