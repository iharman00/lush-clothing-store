import { validateRequest } from "@/auth/middlewares";
import { LoginCard } from "@/components/LoginCard";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return <LoginCard />;
};

export default page;
