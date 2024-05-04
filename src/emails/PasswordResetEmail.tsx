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
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  username?: string;
  changePasswordLink?: string;
}

export const PasswordResetEmail = ({
  username,
  changePasswordLink,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Hi {username!}, Reset Your Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hi, {username}</Heading>
        <Heading style={h2}>Reset Your Password</Heading>
        <Link
          href={changePasswordLink}
          target="_blank"
          style={{
            ...link,
            display: "block",
            marginBottom: "16px",
          }}
        >
          Click here to reset your account Password
        </Link>
        <Text style={{ ...text, marginBottom: "14px" }}>
          Or, copy and paste this temporary password reset link:
        </Text>
        <code style={code}>{changePasswordLink}</code>

        <Text style={text}>
          This link is&apos; only valid for 24 hours from the time of issuance.
        </Text>

        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t try to change your password, you can safely ignore this email.
        </Text>

        <Img
          src="https://github.com/mukulpadwal/quantum-revision/raw/main/public/logo.jpeg"
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

export default PasswordResetEmail;

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

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
