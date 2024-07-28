"use client";

import { useFormState } from "react-dom";
import { register } from "@/actions/auth";

const page = () => {
  const [state, formAction] = useFormState(register, null);
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold">Register Form</h1>
      <form action={formAction}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text" name="firstName" id="firstName" />
          {state?.errors.firstName && <p>{state.errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" name="lastName" id="lastName" />
          {state?.errors.lastName && <p>{state.errors.lastName}</p>}
        </div>

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

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" name="confirmPassword" id="confirmPassword" />
          {state?.errors?.confirmPassword && (
            <p>{state.errors.confirmPassword}</p>
          )}
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default page;
