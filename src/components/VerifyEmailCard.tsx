"use client";

import { useEffect, useState } from "react";

import {
  verifyEmailFormSchema,
  verifyEmailFormType,
} from "@/auth/definitions/verifyEmail";
import {
  verifyEmail,
  type Response as ActionResponse,
} from "@/auth/actions/verifyEmail";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import sendVerificationCode from "@/auth/utils/sendVerificationCode";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";

const VerifyEmailCard = ({ user }: any) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<ActionResponse | null>(null);

  const form = useForm<verifyEmailFormType>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      pin: "",
      ...(formState?.fields ?? {}),
    },
  });

  const submit: SubmitHandler<verifyEmailFormType> = async (data) => {
    const formData = new FormData();
    Object.entries(data).map(([key, val]) => {
      formData.append(key, val);
    });
    const res = await verifyEmail(formData);
    setFormState(res);
  };

  useEffect(() => {
    if (formState?.success === false) {
      toast({ variant: "destructive", description: formState.message });
      if (formState?.errors?.pin) {
        formState.errors.pin.map((err) => {
          form.setError("pin", {
            type: "manual",
            message: err,
          });
        });
      }
    }
  }, [formState]);

  return (
    <Card className="flex flex-col mt-20 mx-auto w-max px-8 py-6">
      <CardHeader className="text-center gap-2">
        <CardTitle>Please check your email</CardTitle>
        <CardDescription>
          We've sent a code to
          {` ${user.email ? user.email : "your email"}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex flex-col items-center gap-4 my-2"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl autoFocus>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="mx-auto">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Verify
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p
          className={`${buttonVariants({
            variant: "link",
          })} mx-auto cursor-pointer`}
          onClick={async () => {
            const res = await sendVerificationCode(user);
            if (res.data?.id) {
              toast({
                description: "Verification code sent",
              });
              form.reset();
              return;
            }
            if (res.error) {
              toast({
                description: "Failed to send verification code",
              });
            }
          }}
        >
          Didn't receive the code? Resend
        </p>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailCard;
