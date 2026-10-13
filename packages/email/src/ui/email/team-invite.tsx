import {
  EmailButton,
  EmailCard,
  EmailHeading,
  EmailText,
  ShadcnEmail,
} from "@opencoredev/email-sdk/react";

export function TeamInviteEmail({ inviteUrl, inviter }: { inviteUrl: string; inviter: string }) {
  return (
    <ShadcnEmail preview={`${inviter} invited you to join Acme`}>
      <EmailCard>
        <EmailHeading>Join {inviter} on Acme</EmailHeading>
        <EmailText>{inviter} invited you to collaborate in the Acme workspace.</EmailText>
        <EmailText
          style={{
            borderLeft: "2px solid #d4d4d8",
            color: "#52525b",
            fontStyle: "italic",
            paddingLeft: 16,
          }}
        >
          “We’re keeping launch notes, approvals, and customer updates here.”
        </EmailText>
        <EmailButton href={inviteUrl}>Join workspace</EmailButton>
      </EmailCard>
    </ShadcnEmail>
  );
}
