import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface BetterAuthInviteUserEmailProps {
  username?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  appName?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
}

const InviteUserEmail = ({
  username,
  invitedByUsername,
  invitedByEmail,
  appName,
  teamName,
  teamImage,
  inviteLink,
}: BetterAuthInviteUserEmailProps) => {
  const previewText = `Join ${invitedByUsername} on BetterAuth`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{invitedByUsername}</strong> on <strong>{appName}.</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">Hello there,</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername}</strong> (
              <Link className="text-blue-600 no-underline" href={`mailto:${invitedByEmail}`}>
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{teamName}</strong> team on{" "}
              <strong>{appName}</strong>.
            </Text>
            <Section>
              {teamImage ? (
                <Row>
                  <Column align="left">
                    <Img
                      className="rounded-full"
                      fetchPriority="high"
                      height="64"
                      src={teamImage}
                      width="64"
                    />
                  </Column>
                </Row>
              ) : null}
            </Section>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link className="text-blue-600 no-underline" href={inviteLink}>
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for <span className="text-black">{username}</span>. If
              you were not expecting this invitation, you can ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InviteUserEmail.PreviewProps = {
  username: "sumo",
  invitedByUsername: "sumo_demo",
  invitedByEmail: "sumo@demo.com",
  teamName: "goteam",
  teamImage: "/static/vercel-user.png",
  inviteLink: "http://localhost:3000/invite",
} as BetterAuthInviteUserEmailProps;

export { InviteUserEmail };
export type { BetterAuthInviteUserEmailProps };

export default InviteUserEmail;
