import VerifyEmailCard from "@/components/VerifyEmailCard";
import { getUser } from "@/data/user";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await getUser();
  if (!user || user?.emailVerified === true) {
    redirect("/");
  }
  return <VerifyEmailCard user={user} />;
};

export default page;
