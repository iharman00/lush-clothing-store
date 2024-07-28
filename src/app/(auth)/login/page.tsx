"use client";

import { useFormState } from "react-dom";
import { login } from "@/actions/auth";

const page = () => {
  const [state, formAction] = useFormState(login, null);
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold">Login Form</h1>
      <form action={formAction}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          {state?.errors.email && <p>{state.errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          {state?.errors.password && <p>{state.errors.password}</p>}
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default page;
