import { getUser } from "@/data/user";
import { redirect } from "next/navigation";
import { CircleCheck } from "lucide-react";

const page = async () => {
  const { user } = await getUser();
  if (!user || user?.emailVerified === false) {
    redirect("/");
  }
  return (
    <div className="flex flex-col items-center gap-4 mt-20 mx-auto w-max">
      <CircleCheck color="#4BB543" size="8rem" strokeWidth="1px" />
      <h1 className="font-bold text-3xl">Email Verified</h1>
      <p>
        Congratulations <span className="capitalize">{user?.firstName}</span>,
        you have succesfully verified your email!
      </p>
    </div>
  );
};

export default page;
