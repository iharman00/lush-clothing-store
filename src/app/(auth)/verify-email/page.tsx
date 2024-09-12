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
    <div className="container flex items-center justify-center my-20">
      <VerifyEmailForm user={user} />
    </div>
  );
};

export default page;
