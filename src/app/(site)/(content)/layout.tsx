import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
        <Toaster />
      </main>
      <Footer />
    </>
  );
}
