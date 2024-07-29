"use client";

import { useFormState } from "react-dom";
import { logout } from "@/auth/actions";
import { buttonVariants } from "@/components/ui/button";

const page = () => {
  const [state, action] = useFormState(logout, null);
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold">Logout </h1>
      <form action={action}>
        {state?.error && <p>{state.error}</p>}
        <button className={buttonVariants()}>Logout</button>
      </form>
    </div>
  );
};

export default page;
