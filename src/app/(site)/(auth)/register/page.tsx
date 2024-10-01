import { validateRequest } from "@/auth/middlewares";
import RegisterForm from "@/components/RegisterForm";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return (
    <div className="container flex items-center justify-center my-10">
      <RegisterForm />
    </div>
  );
};

export default page;
