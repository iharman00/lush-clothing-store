"use client";

import { useFormState } from "react-dom";
import { login } from "@/auth/actions/login";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();
  let [state, action] = useFormState(login, null);
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
    if (state?.success === false) {
      const timeoutId = setTimeout(() => {
        toast.error(state.message);
      });
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
      return () => clearTimeout(timeoutId);
    }
  }, [state]);

  useEffect(() => {
    if (state?.success) {
      const timeoutId = setTimeout(() => {
        toast.success(state.message);
      });
      router.push("/");

      return () => clearTimeout(timeoutId);
    }
  }, [state]);

  return (
    <div className="max-w-[30%] mx-auto">
      <h1 className="text-3xl font-bold mb-10">Login Form</h1>
      <Form {...form}>
        <form
          ref={formRef}
          action={action}
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

// "use client"

// import { Icons } from "@/components/icons"
// import { Button } from "@/registry/new-york/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/registry/new-york/ui/card"
// import { Input } from "@/registry/new-york/ui/input"
// import { Label } from "@/registry/new-york/ui/label"

// export function DemoCreateAccount() {
//   return (
//     <Card>
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl">Create an account</CardTitle>
//         <CardDescription>
//           Enter your email below to create your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="grid gap-4">
//         <div className="grid grid-cols-2 gap-6">
//           <Button variant="outline">
//             <Icons.gitHub className="mr-2 h-4 w-4" />
//             Github
//           </Button>
//           <Button variant="outline">
//             <Icons.google className="mr-2 h-4 w-4" />
//             Google
//           </Button>
//         </div>
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-background px-2 text-muted-foreground">
//               Or continue with
//             </span>
//           </div>
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" type="email" placeholder="m@example.com" />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="password">Password</Label>
//           <Input id="password" type="password" />
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Button className="w-full">Create account</Button>
//       </CardFooter>
//     </Card>
//   )
// }
