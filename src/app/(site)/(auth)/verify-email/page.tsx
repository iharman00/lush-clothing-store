import { buttonVariants } from "@/components/ui/button";
import VerifyEmailForm from "@/components/VerifyEmailForm";
import { getCurrentClientSideUser } from "@/data_access/user";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  let user;
  try {
    user = await getCurrentClientSideUser();
  } catch (error) {
    // If there's an error, the user is not logged in
    // We redirect
    redirect("/login");
  }
  return (
    <div className="w-full max-w-96 flex flex-col gap-8">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-center">
          {!user && "Email Verification"}
          {user && user.emailVerified && "Your email is already verified!"}
          {user && !user.emailVerified && "Please check your email"}
        </h1>
        <p className="text-base text-muted-foreground">
          {!user && "You need to be logged in to request an OTP"}
          {user && !user.emailVerified && `We've sent a code to ${user.email}`}
        </p>
      </div>
      {!user && (
        <Link href="/login" className={buttonVariants()}>
          Log In
        </Link>
      )}
      {user && user.emailVerified && (
        <Link href="/" className={buttonVariants()}>
          Continue Shopping
        </Link>
      )}
      {user && !user.emailVerified && <VerifyEmailForm user={user} />}
    </div>
  );
};

export default page;
