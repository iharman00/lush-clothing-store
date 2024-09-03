import * as React from "react";

interface EmailTemplateProps {
  verificationCode: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  verificationCode,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      color: "#333",
      lineHeight: "1.6",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    }}
  >
    <header
      style={{
        textAlign: "center",
        marginBottom: "20px",
      }}
    >
      <h1
        style={{
          color: "#007bff",
          fontSize: "24px",
          margin: "0",
        }}
      >
        Welcome to Lush!
      </h1>
    </header>
    <main>
      <p
        style={{
          fontSize: "16px",
        }}
      >
        Hi there,
      </p>
      <p
        style={{
          fontSize: "16px",
        }}
      >
        Thank you for registering with us. To complete the verification process,
        please use the following OTP (One-Time Password):
      </p>
      <p
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          margin: "20px 0",
          padding: "15px",
          border: "1px solid #007bff",
          borderRadius: "5px",
          backgroundColor: "#e7f0ff",
          color: "#007bff",
        }}
      >
        {verificationCode}
      </p>
      <p
        style={{
          fontSize: "16px",
        }}
      >
        This OTP will be valid for 15 minutes from now.
      </p>
      <p
        style={{
          fontSize: "16px",
        }}
      >
        If you did not request this verification code, please ignore this email.
      </p>
      <p
        style={{
          fontSize: "16px",
        }}
      >
        Best regards,
        <br />
        Lush Team
      </p>
    </main>
    <footer
      style={{
        marginTop: "20px",
        textAlign: "center",
        fontSize: "14px",
        color: "#666",
      }}
    >
      <p>&copy; {new Date().getFullYear()} Lush. All rights reserved.</p>
    </footer>
  </div>
);
