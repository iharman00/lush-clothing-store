import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

// Wraps all form elements
// To keep the styling of forms consistent

const FormCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <Card ref={ref} {...props} className="w-full max-w-sm"></Card>
));
FormCard.displayName = "FormCard";

const FormHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <CardHeader ref={ref} {...props}></CardHeader>);
FormHeader.displayName = "FormHeader";

const FormTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ ...props }, ref) => (
  <CardTitle ref={ref} {...props} className="text-center text-2xl"></CardTitle>
));
FormTitle.displayName = "FormTitle";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ ...props }, ref) => (
  <CardDescription
    ref={ref}
    {...props}
    className="text-balance text-muted-foreground text-sm"
  ></CardDescription>
));
FormDescription.displayName = "FormDescription";

const FormContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <CardContent ref={ref} {...props}></CardContent>);
FormContent.displayName = "FormContent";

const FormFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <CardFooter ref={ref} {...props} className="grid gap-4"></CardFooter>
));
FormFooter.displayName = "FormFooter";

export {
  FormCard,
  FormHeader,
  FormTitle,
  FormDescription,
  FormContent,
  FormFooter,
};
