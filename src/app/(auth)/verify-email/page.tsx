import VerifyEmailForm from "@/components/VerifyEmailForm";
import { getCurrentUser } from "@/data_access/user";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await getCurrentUser();
  if (!user || user?.emailVerified === true) {
    redirect("/");
  }
  return (
    <div className="container flex items-center justify-center my-20">
      <VerifyEmailForm user={user} />
    </div>
  );
};

export default page;
