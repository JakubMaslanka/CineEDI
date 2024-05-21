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

interface RentEndEmailProps {
  homeLink: string;
  rentId: number;
  movieTitle: string;
  userName: string;
}

export const RentEndEmail = ({
  homeLink,
  movieTitle,
  userName,
  rentId,
}: RentEndEmailProps) => (
  <Html>
    <Head />

    <Preview>
      [CineEDI]{" "}
      {`Twoje wypożyczenie filmu "${movieTitle}" właśnie dobiego końca`}
    </Preview>
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
          <Text style={text}>Cześć, {userName}!</Text>
          <Text style={text}>
            Informujemy, że Twoje wypożyczenie o identyfikatorze &ldquo;{rentId}
            &rdquo;, filmu pod tytułem &ldquo;{movieTitle}&rdquo; właśnie
            dobiego końca.
          </Text>
          <Hr style={hr} />
          <Text style={text}>
            Mamy nadzieje, że produkcja przypadła Ci do gustu. Zapraszamy do
            dalszej eksploracji naszej biblioteki filmów, do której przeniesiesz
            się po naciśnięciu przycisku poniżej
          </Text>
          <Button style={button} href={homeLink}>
            Nasza biblioteka filmów
          </Button>
          <Text style={{ ...text, color: "#404040", paddingBottom: "48px" }}>
            Jeżeli nie korzystałeś z naszej platformy, a wiadomość wydaje Ci się
            nie związana z twoimi ostatnimi akcjami, prosimy o usunięcie
            wiadomość i kontakt z zespołem cineEDI. Mogło dość do nadużyć z
            wykorzystaniem twojego adresu mailowego.
          </Text>
          <Text style={{ ...text, margin: 0 }}>Miłych seansów życzy,</Text>
          <Text style={{ ...text, margin: 0 }}>Zespół CineEDI!</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

RentEndEmail.PreviewProps = {
  homeLink: "https://cineedi.online/home",
  movieTitle: "Pulp Fiction",
  userName: "Jan Kowalski",
  rentId: 1,
} as RentEndEmailProps;

export default RentEndEmail;

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
  margin: "24px auto 24px auto",
};

const hr = {
  width: "100%",
  border: "none",
  borderTop: "1px solid #404040",
  height: "0.5px",
  padding: "12px 0px 12px 0px",
};
