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

interface ResetPasswordEmailProps {
  resetPasswordLink: string;
}
export const ResetPasswordEmail = ({
  resetPasswordLink,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>[CineEDI] Resetowanie hasła do platformy</Preview>
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
            Otrzymaliśmy żądanie o zmianę hasła do konta w portalu CineEDI.
            {"\n"}Jeśli to Ty, możesz ustawić nowe hasło tutaj:
          </Text>
          <Button style={button} href={resetPasswordLink}>
            Resetuj hasło
          </Button>
          <Hr style={hr} />
          <Text style={text}>
            Jeżeli nie chcesz zmienić swojego hasła, albo nie Ty wysłałeś
            żądanie, po prostu zignoruj i usuń tę wiadomość.
          </Text>
          <Text style={{ ...text, paddingBottom: "48px" }}>
            Aby utrzymać swoje konto bezpiecznym, proszę nie przekazuj tej
            wiadomości nikomu niezaufanemu!
          </Text>
          <Text style={text}>Zespół CineEDI!</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

ResetPasswordEmail.PreviewProps = {
  resetPasswordLink: "https://cineedi.com/auth/new-password?token=1234",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

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
