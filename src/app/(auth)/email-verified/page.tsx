import { getCurrentUser } from "@/data_access/user";
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

const page = async () => {
  const { user } = await getCurrentUser();
  if (!user || user?.emailVerified === false) {
    redirect("/");
  }
  return (
    <Card className="mt-20 mx-auto w-max px-6 py-8">
      <CardHeader className="flex flex-col items-center gap-4">
        <CircleCheck color="#4BB543" size="6rem" strokeWidth="1px" />
        <div className="flex flex-col items-center gap-2">
          <CardTitle>Email Verified</CardTitle>
          <CardDescription>
            Congratulations{" "}
            <span className="capitalize">{user?.firstName}</span>, you have
            succesfully verified your email!
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-6 justify-center">
        <Link
          href="/"
          className={`${buttonVariants()} col-start-3 col-span-2 `}
        >
          Ok
        </Link>
      </CardContent>
    </Card>
  );
};

export default page;
