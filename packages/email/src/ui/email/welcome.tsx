import {
  EmailButton,
  EmailCard,
  EmailHeading,
  EmailText,
  ShadcnEmail,
} from "@opencoredev/email-sdk/react";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <ShadcnEmail preview="Your workspace is ready">
      <EmailCard>
        <EmailHeading>Your workspace is ready</EmailHeading>
        <EmailText>
          Welcome, {name}. Send your first email or invite your team when you’re ready.
        </EmailText>
        <EmailText>✓ Connect a provider</EmailText>
        <EmailText>✓ Send a test email</EmailText>
        <EmailText>✓ Invite your team</EmailText>
        <EmailButton href="https://acme.com/dashboard">Open dashboard</EmailButton>
      </EmailCard>
    </ShadcnEmail>
  );
}
