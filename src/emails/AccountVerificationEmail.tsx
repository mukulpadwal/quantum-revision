import conf from "@/conf/conf";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

interface AccountVerificationEmailProps {
  username?: string;
  otp: string;
}

export const AccountVerificationEmail = ({
  username,
  otp,
}: AccountVerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Hi {username!}, Here&apos;s your verification code : {otp}
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hi, {username}</Heading>
        <Heading style={h2}>Your Account verification OTP</Heading>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{otp}</Text>
        </Section>

        <Text style={text}>
          This OTP is&apos; only valid for 24 hours from the time of issuance.
        </Text>
  
        <Text style={text}>
          If you didn&apos;t request this email, there&apos;s nothing to worry
          about, you can safely ignore it.
        </Text>

        <Img
          src="https://github.com/mukulpadwal/quantum-revision/raw/main/public/images/logo.jpeg"
          width="32"
          height="32"
          alt="Quantum Revision Logo"
        />
        <Text style={footer}>
          <Link
            href={conf.domain}
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            Quantum Revision
          </Link>
          <br />
          Transform Your Study Sessions with QuantumRevision!
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AccountVerificationEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "20px 0 0 0",
  padding: "0",
};

const h2 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};
