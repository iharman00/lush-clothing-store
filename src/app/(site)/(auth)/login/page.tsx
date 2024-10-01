import { validateRequest } from "@/auth/middlewares";
import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return (
    <div className="container flex items-center justify-center my-10">
      <LoginForm />
    </div>
  );
};

export default page;
