import { validateRequest } from "@/auth/middlewares";
import RegisterCard from "@/components/RegisterCard";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return <RegisterCard />;
};

export default page;
