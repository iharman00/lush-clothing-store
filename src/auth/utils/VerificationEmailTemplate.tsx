import * as React from "react";

interface EmailTemplateProps {
  verificationCode: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  verificationCode,
}) => (
  <div>
    <h1>Welcome, User!</h1>
    <p>Here's your Verification Code {verificationCode}</p>
  </div>
);
