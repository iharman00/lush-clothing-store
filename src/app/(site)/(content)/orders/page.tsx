import { getCurrentClientSideUser } from "@/data_access/user";
import OrdersClientPage from "./page.client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function Page() {
  const user = await getCurrentClientSideUser();

  if (!user) {
    return (
      <div className="container max-w-4xl py-10">
        <p className="text-4xl font-bold ">
          Please log in to view your orders.
        </p>
        <Link href="/login" className={buttonVariants({ className: "mt-10" })}>
          Login to your account
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mt-20 mb-28">
      <div className="mb-8 flex items-center gap-2">
        <h1 className="text-4xl md:text-5xl xl:text-7xl font-light tracking-wide uppercase">
          Your orders
        </h1>
      </div>

      <OrdersClientPage user={user} />
    </div>
  );
}
