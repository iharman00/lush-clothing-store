import RegisterForm from "@/components/RegisterForm";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/data_access/user";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    // If there's an error, the user is not logged in
    // We do nothing
  }
  if (user) redirect("/");

  return (
    <div className="w-full max-w-96 flex flex-col gap-10">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">Create Account</h1>
        <p className="text-base text-muted-foreground">
          Register for an account today!
        </p>
      </div>
      <RegisterForm />
      <Link
        href="/login"
        className={buttonVariants({
          variant: "link",
        })}
      >
        Already have an account? Log In
      </Link>
    </div>
  );
};

export default page;
