"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div>
      <Toaster />
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
      {children}
    </div>
  );
}
