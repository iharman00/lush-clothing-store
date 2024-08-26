"use client";

import { useEffect, useState } from "react";

import { loginFormSchema, loginFormType } from "@/auth/definitions/loginForm";
import { login, type Response as ActionResponse } from "@/auth/actions/login";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowRight } from "lucide-react";
import { useToast } from "./ui/use-toast";

export function LoginCard() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<ActionResponse | null>(null);

  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(formState?.fields ?? {}),
    },
  });

  const submit: SubmitHandler<loginFormType> = async (data) => {
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
    <Card className="flex flex-col mx-auto mt-10 sm:w-[400px] px-2 py-6 ">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="mx-auto">
          <Link
            href="/register"
            className={buttonVariants({
              variant: "link",
            })}
          >
            Don&apos;t have an account? Register now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
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
              Log In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="grid gap-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            {/* <Icons.gitHub className="mr-2 h-4 w-4" /> */}
            Google
          </Button>
          <Button variant="outline">
            {/* <Icons.google className="mr-2 h-4 w-4" /> */}
            Apple
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoginCard;
