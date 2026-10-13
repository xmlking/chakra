import {
  EmailButton,
  EmailCard,
  EmailHeading,
  EmailText,
  ShadcnEmail,
} from "@opencoredev/email-sdk/react";

export function UsageAlertEmail({ percent }: { percent: number }) {
  return (
    <ShadcnEmail preview={`You have used ${percent}% of this month’s email volume`}>
      <EmailCard>
        <EmailHeading>You’re nearing your email limit</EmailHeading>
        <EmailText>Your workspace has used {percent}% of its monthly email volume.</EmailText>
        <div
          style={{
            backgroundColor: "#e4e4e7",
            borderRadius: 999,
            height: 8,
            margin: "24px 0",
            overflow: "hidden",
          }}
        >
          <div style={{ backgroundColor: "#18181b", height: "100%", width: `${percent}%` }} />
        </div>
        <EmailText>85,240 of 100,000 emails used</EmailText>
        <EmailButton href="https://acme.com/usage">Review usage</EmailButton>
      </EmailCard>
    </ShadcnEmail>
  );
}
