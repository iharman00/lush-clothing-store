import { validateRequest } from "@/auth/middlewares";
import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return <LoginForm />;
};

export default page;
