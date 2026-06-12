// @ts-nocheck
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface VerifyEmailProps {
  url: string;
  userName: string;
}

const VerifyEmail = ({ url, userName }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Please verify your email</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-gray-100 font-sans text-gray-700">
        <Container className="mx-auto w-[500px]">
          <Section className="mt-[32px]">
            <Img
              alt={process.env.VITE_APP_NAME}
              className="my-0 mr-auto"
              height="40"
              src="https://assets.vrite.io/6409e82d7dfc74cef7a72e0d/v0aihKNNJQGDAoYJN5Ml6.png"
              width="95"
            />
          </Section>
          <Heading className="mx-0 mb-[12px] p-0 text-start text-[21px] font-bold">
            Welcome to {process.env.VITE_APP_NAME}, {userName}!
          </Heading>
          <Text className="text-[14px] leading-[22px]">
            Thanks for signing up! We're excited to have you as a user and can't wait to see what
            you will create!
          </Text>
          <Text className="text-[14px] leading-[22px]">
            To access the platform, please verify your email address:
          </Text>
          <Button
            className="rounded-[8px] bg-gray-200 px-[18px] py-[12px] text-[14px] text-gray-500"
            clicktracking="off"
            href={url}
          >
            Verify email address{" "}
          </Button>
          <Section className="text-start text-[14px] leading-[22px]">
            <Text className="mb-0 leading-[14px]">or follow this link:</Text>
            <Link className="text-blue-600 no-underline" clicktracking="off" href={url}>
              {url}
            </Link>
            <Text>
              If you didn't sign up for {process.env.VITE_APP_NAME}, you can ignore this email.
            </Text>
          </Section>
          <Text className="my-0 text-[12px]">{process.env.VITE_APP_NAME} ©2026</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

VerifyEmail.PreviewProps = {
  userName: "Sumo",
  url: `${process.env.VITE_APP_URL}/verify`,
} as VerifyEmailProps;

export { VerifyEmail };
export type { VerifyEmailProps };

// oxlint-disable-next-line import/no-default-export
export default VerifyEmail;
