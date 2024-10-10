import { LoginForm } from "@/components/LoginForm";
import LogoutButton from "@/components/LogoutButton";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/data_access/user";
import Link from "next/link";

const page = async () => {
  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    // If there's an error, the user is not logged in
    // We do nothing
  }

  return (
    <div className="w-full max-w-96 flex flex-col gap-10">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">
          {user ? "Oops!" : "Welcome Back!"}
        </h1>
        <p className="text-base text-muted-foreground">
          {user
            ? "You are already logged in"
            : "Log in to access your account."}
        </p>
      </div>
      {user ? (
        <div className="grid grid-cols-2 gap-4">
          <LogoutButton />
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            Go to Home
          </Link>
        </div>
      ) : (
        <>
          <LoginForm />
          <Link
            href="/register"
            className={buttonVariants({
              variant: "link",
            })}
          >
            Don't have an account? Register
          </Link>
        </>
      )}
    </div>
  );
};

export default page;
