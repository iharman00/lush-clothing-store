import { getCurrentClientSideUser } from "@/data_access/user";
import { redirect } from "next/navigation";
import { CircleCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const page = async () => {
  let user;
  try {
    user = await getCurrentClientSideUser();
    if (!user.emailVerified) redirect("/");
  } catch (error) {
    // If there's an error, the user is not logged in
    // We redirect
    redirect("/");
  }
  return (
    <div className="w-full max-w-96 flex flex-col gap-12">
      <div className="text-center flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Wohoo!</h1>
        <p className="text-base text-muted-foreground">
          Registration complete! Get ready to have the best shopping experience
          of your life.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants(), "font-normal")}>
        Let the Shopping begin!
      </Link>
    </div>
  );
};

export default page;
