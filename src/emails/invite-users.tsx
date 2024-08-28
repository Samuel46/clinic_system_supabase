import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvitationEmailProps {
  url: string;
  name: string;
}

export const InvitationEmail = ({ url, name }: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>Invitation from {name}.</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Img
          src={`https://res.cloudinary.com/djq4rtqth/image/upload/v1719233328/Group_1_nfbplb.png`}
          width="170"
          height="50"
          alt="Koala"
          style={logo}
        /> */}
        <Text style={paragraph}>Hello,</Text>
        <Text style={paragraph}>
          You&apos;ve been invited by {name}. Click the link below to complete your
          registration:
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={url}>
            Complete Registration
          </Button>
        </Section>
        <Text style={paragraph}>
          Take care,
          <br />
          {/* The LyreSolution */}
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Kenya, Nairobi</Text>
      </Container>
    </Body>
  </Html>
);

export default InvitationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
