import { validateRequest } from "@/auth/middlewares";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  console.log(user);
  return (
    <div>
      <p>Welcome to protected page</p>
      {/* <p>{user}</p> */}
    </div>
  );
};

export default page;
