import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
