"use client";

import { useFormState } from "react-dom";
import { login } from "@/auth/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginFormSchema, loginFormType } from "@/auth/definitions";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

const page = () => {
  let [state, formAction] = useFormState(login, null);
  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(state?.fields ?? {}),
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.errors?.email) {
      state.errors.email.map((err) => {
        form.setError("email", {
          type: "manual",
          message: err,
        });
      });
    }
    if (state?.errors?.password) {
      state.errors.password.map((err) => {
        form.setError("password", {
          type: "manual",
          message: err,
        });
      });
    }
  }, [form.setError]);

  return (
    <div className="max-w-[30%] mx-auto">
      <h1 className="text-3xl font-bold mb-10">Login Form</h1>
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={form.handleSubmit(() => formRef.current?.submit())}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    required
                    placeholder="you@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    required
                    placeholder="Your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
