import VerifyEmailForm from "@/components/VerifyEmailForm";
import { getCurrentClientSideUser } from "@/data_access/user";
import { redirect } from "next/navigation";

const page = async () => {
  let user;
  try {
    user = await getCurrentClientSideUser();
    if (user.emailVerified) redirect("/");
  } catch (error) {
    // If there's an error, the user is not logged in
    // We redirect
    redirect("/");
  }
  return (
    <div className="w-full max-w-96 flex flex-col gap-8">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-center">
          Please check your email
        </h1>
        <p className="text-base text-muted-foreground">
          We've sent a code to {` ${user.email ? user.email : "your email"}`}
        </p>
      </div>
      <VerifyEmailForm user={user} />
    </div>
  );
};

export default page;
