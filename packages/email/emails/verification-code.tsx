import { EmailCard, EmailHeading, EmailText, ShadcnEmail } from "@opencoredev/email-sdk/react";
import { Preview } from "react-email";

export const VerificationCodeEmail = ({ code }: { code: string }) => {
  return (
    <ShadcnEmail>
      <Preview>{code} is your verification code</Preview>
      <EmailCard>
        <EmailHeading>Verify your email</EmailHeading>
        <EmailText>Enter this code to finish signing in. It expires in 10 minutes.</EmailText>
        <EmailText
          style={{
            backgroundColor: "#f4f4f5",
            borderRadius: 8,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 8,
            padding: "18px 20px",
            textAlign: "center",
          }}
        >
          {code}
        </EmailText>
        <EmailText muted>If you didn’t request this code, ignore this email.</EmailText>
      </EmailCard>
    </ShadcnEmail>
  );
};

VerificationCodeEmail.PreviewProps = {
  code: "123456",
};
export default VerificationCodeEmail;
