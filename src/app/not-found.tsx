import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Custom404() {
  return (
    <section className="container flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Page not found.</h1>
        <p className="mt-2 text-sm md:text-base">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-4")}>
          Go Back Home
        </Link>
      </div>
    </section>
  );
}
