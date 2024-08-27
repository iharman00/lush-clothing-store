"use client";

import { useEffect, useState } from "react";

import {
  registerFormSchema,
  registerFormType,
} from "@/auth/definitions/registerForm";
import {
  register,
  type Response as ActionResponse,
} from "@/auth/actions/register";

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
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export function RegisterCard() {
  const { toast } = useToast();
  const [state, setState] = useState<ActionResponse | null>(null);
  const form = useForm<registerFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      ...(state?.fields ?? {}),
    },
  });
  const submit: SubmitHandler<registerFormType> = async (data) => {
    const formData = new FormData();
    Object.entries(data).map(([key, val]) => {
      formData.append(key, val);
    });
    const res = await register(formData);
    setState(res);
  };

  useEffect(() => {
    if (state?.success === false) {
      toast({ variant: "destructive", description: state.message });
      if (state?.errors?.email) {
        state.errors.email.map((err) => {
          form.setError("email", {
            type: "manual",
            message: err,
          });
        });
      }
    }
  }, [state]);

  return (
    <Card className="mt-10 mx-auto sm:w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Register Now</CardTitle>
        <CardDescription className="mx-auto">
          <Link
            href="/login"
            className={buttonVariants({
              variant: "link",
            })}
          >
            Already have an account? Log In
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      placeholder="John"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      placeholder="Doe"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      placeholder="Your strong password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      required
                      placeholder="Your strong password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting}>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default RegisterCard;
