export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container min-h-[75vh] md:flex justify-center items-center">
      {children}
    </div>
  );
}
