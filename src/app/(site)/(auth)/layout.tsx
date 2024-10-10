"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div>
      <Toaster />
      <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="relative hidden w-full h-full lg:col-span-6 lg:flex flex-col justify-center items-center p-2 rounded-xl">
          <Image
            src="/auth-hero.jpg"
            alt="hero Image"
            width={2000}
            height={2000}
            className="absolute inset-0 object-cover object-top w-full h-full"
          />
        </div>
        <div className="lg:col-span-6 grid grid-rows-[auto_1fr] place-items-center h-full">
          <div className="px-1 py-2 md:px-8 md:py-6 flex justify-between items-center w-full h-fit">
            <div className="flex items-center gap-2">
              {/* Back button */}
              <Button
                variant="ghost"
                className="rounded-full w-14 h-14"
                onClick={() => router.back()}
              >
                <MoveLeft />
              </Button>
              <Separator
                orientation="vertical"
                className="hidden md:visible mr-2 h-10"
              />
              {/* Brand logo */}
              <Link href="/">
                <Image
                  src="/lush_logo.svg"
                  alt="lush logo"
                  width={50}
                  height={50}
                  className="mr-4"
                />
              </Link>
            </div>
            {/* Exit button */}
            <Button
              variant="link"
              className="text-base"
              onClick={() => router.push("/")}
            >
              Exit
            </Button>
          </div>
          <div className="px-10 mb-22 w-full flex justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
