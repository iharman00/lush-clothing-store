"use client";

import { useEffect, useState } from "react";

import { loginFormSchema, LoginFormType } from "@/schemas/auth/loginFormSchema";
import login, { type Response as ActionResponse } from "@/auth/actions/login";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./ui/LoadingSpinner";
import sendOTPEmail from "@/auth/actions/sendOTPEmail";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [formState, setFormState] = useState<ActionResponse | null>(null);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(formState?.fields ?? {}),
    },
  });

  const submit: SubmitHandler<LoginFormType> = async (data) => {
    const formData = new FormData();
    Object.entries(data).map(([key, val]) => {
      formData.append(key, val);
    });
    const res = await login(formData);
    setFormState(res);
    if (res.success) {
      toast({ description: res.message });
      if (res.emailVerified) {
        router.push("/");
      } else {
        sendOTPEmail();
        router.push("/verify-email");
      }
    }
  };

  useEffect(() => {
    if (formState?.success === false) {
      toast({ variant: "destructive", description: formState.message });
      if (formState?.errors?.email) {
        formState.errors.email.map((err) => {
          form.setError("email", {
            type: "manual",
            message: err,
          });
        });
      }
      if (formState?.errors?.password) {
        formState.errors.password.map((err) => {
          form.setError("password", {
            type: "manual",
            message: err,
          });
        });
      }
    }
  }, [formState, form, toast]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-6 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl autoFocus>
                <Input
                  type="email"
                  required
                  placeholder="you@mail.com"
                  autoComplete="email"
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
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-2 w-full"
          disabled={form.formState.isSubmitting}
          size="lg"
        >
          {form.formState.isSubmitting ? <LoadingSpinner /> : "Log In"}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
