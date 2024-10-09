"use client";

import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
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
      <div className="flex flex-col justify-center items-center lg:col-span-6 h-full relative">
        <div className="absolute top-0 px-8 py-6 flex justify-between items-center w-full h-fit">
          {/* Back button */}
          <Button
            variant="ghost"
            className="rounded-full w-14 h-14"
            onClick={() => router.back()}
          >
            <MoveLeft />
          </Button>
          {/* Exit button */}
          <Button
            variant="link"
            className="text-base"
            onClick={() => router.push("/")}
          >
            Exit
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
