"use client";

import { useEffect, useState } from "react";

import {
  verifyEmailFormSchema,
  VerifyEmailFormType,
} from "@/auth/schemas/verifyEmailFormSchema";
import verifyEmail, {
  type Response as ActionResponse,
} from "@/auth/actions/verifyEmail";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserDTO } from "@/data_access/user/userDTO";
import sendOTPEmail from "@/auth/actions/sendOTPEmail";

const VerifyEmailForm = ({ user }: { user: Omit<UserDTO, "password"> }) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<ActionResponse | null>(null);

  const form = useForm<VerifyEmailFormType>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      pin: "",
      ...(formState?.fields ?? {}),
    },
  });

  const submit: SubmitHandler<VerifyEmailFormType> = async (data) => {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>One Time Password</FormLabel>
              <FormControl autoFocus>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
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
        <Button className="mt-2" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            "Verify"
          )}
        </Button>
        <Button
          variant="link"
          className="mt-2"
          onClick={async () => {
            const res = await sendOTPEmail();
            if (res.success) {
              toast({
                description: res.message,
              });
              return;
            }
            if (!res.success) {
              toast({
                description: res.message,
              });
            }
          }}
        >
          Didn't receive the email? Resend
        </Button>
      </form>
    </Form>
  );
};

export default VerifyEmailForm;
