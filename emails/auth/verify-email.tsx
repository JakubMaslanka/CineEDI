import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Text,
  Hr,
  Preview,
  Section,
  Link,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
  confirmLink: string;
}
export const VerifyEmail = ({ confirmLink }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>[CineEDI] Zweryfikuj swój adres email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://cineedi.online/logo.svg"
          width="130,5"
          height="48"
          style={{ margin: "0 auto" }}
          alt="CineEDI logo"
        />
        <Section>
          <Text style={text}>Cześć!</Text>
          <Text style={text}>
            Bardzo nam miło, że zdecydowałeś się na utworzenie konta na
            platformie CineEDI. Aby dokończyć proces rejestracji i tym samym
            zweryfikować swój adres email, proszę naciśniej poniższy przycisk:
          </Text>
          <Button style={button} href={confirmLink}>
            Zweryfikuj adres email
          </Button>
          <Hr style={hr} />
          <Text style={{ ...text, paddingBottom: "48px" }}>
            Chcemy, aby twoje doświadczenia z użytkownia CineEDI były jak
            najlepsze. W razie jakichkolwiek pytań prosimy o kontakt pod
            adresem:{" "}
            <Link style={anchor} href="mailto:contact@cineedi.online">
              contact@cineedi.online
            </Link>
          </Text>
          <Text style={text}>Zespół CineEDI!</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

VerifyEmail.PreviewProps = {
  confirmLink: "https://cineedi.com/auth/email-verification?token=1234",
} as VerifyEmailProps;

export default VerifyEmail;

const main = {
  backgroundColor: "#18181B",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#09090B",
  border: "1px solid #404040",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#fff",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#B4151D",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
  margin: "0 auto 64px auto",
};

const hr = {
  width: "100%",
  border: "none",
  borderTop: "1px solid #404040",
  height: "0.5px",
};

const anchor = {
  textDecoration: "underline",
  color: "#B4151D",
};
