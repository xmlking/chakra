import {
  EmailButton,
  EmailCard,
  EmailHeading,
  EmailText,
  ShadcnEmail,
} from "@opencoredev/email-sdk/react";

export function PasswordResetEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <ShadcnEmail preview="Reset your password within the next 30 minutes">
      <EmailCard>
        <EmailHeading>Reset your password</EmailHeading>
        <EmailText>We received a request to reset the password for your Acme account.</EmailText>
        <EmailButton href={resetUrl}>Reset password</EmailButton>
        <EmailText muted style={{ fontSize: 13, marginTop: 20 }}>
          This link expires in 30 minutes. The request came from Safari on macOS.
        </EmailText>
      </EmailCard>
    </ShadcnEmail>
  );
}
