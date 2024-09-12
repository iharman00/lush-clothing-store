"use client";

import { useEffect, useState } from "react";

import { loginFormSchema, LoginFormType } from "@/auth/schemas/loginFormSchema";
import login, { type Response as ActionResponse } from "@/auth/actions/login";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import {
  FormCard,
  FormContent,
  FormFooter,
  FormHeader,
  FormTitle,
} from "@/components/ui/FormCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm() {
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
  }, [formState]);

  return (
    <FormCard>
      <FormHeader>
        <FormTitle>Login</FormTitle>
      </FormHeader>
      <FormContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
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
            <Button className="mt-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
      </FormContent>
      <FormFooter>
        <Link
          href="/register"
          className={buttonVariants({
            variant: "link",
          })}
        >
          Don't have an account? Register
          <ArrowRight className="h-4 w-4" />
        </Link>
      </FormFooter>
    </FormCard>
  );
}

export default LoginForm;