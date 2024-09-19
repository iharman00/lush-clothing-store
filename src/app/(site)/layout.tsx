import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export default function siteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster />
    </>
  );
}
