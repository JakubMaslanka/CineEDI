import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface RentStartEmailProps {
  rentStatusLink: string;
  movieTitle: string;
  userName: string;
  directorName: string;
  rentStartDate: string;
  rentEndDate: string;
  rating: string;
  imageUrl: string;
}

export const RentStartEmail = ({
  rentStatusLink,
  movieTitle,
  userName,
  directorName,
  rentStartDate,
  rentEndDate,
  rating,
  imageUrl,
}: RentStartEmailProps) => (
  <Html>
    <Head />
    <Preview>[CineEDI] {`Właśnie wypożyczyłeś film "${movieTitle}"`}</Preview>
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
            Bardzo nam miło, że coś z zasobów naszej biblioteki filmów wpadło Ci
            w oko.
          </Text>
          <Text style={text}>
            Ta wiadomość to potwierdzenie, że w sposób pomyślny udało Ci się
            wypożyczyć film &ldquo;{movieTitle}&rdquo;. Poniżej znajdują się
            szczegóły transakcji.
          </Text>
          <Hr style={hr} />
          <Section style={{ marginBottom: "24px" }}>
            <Row>
              <Column style={{ width: "64px" }}>
                <Img
                  src={imageUrl}
                  width="64"
                  height="90"
                  alt={`${movieTitle} poster`}
                  style={productIcon}
                />
              </Column>
              <Column style={{ paddingLeft: "22px" }}>
                <Text style={productTitle}>{movieTitle}</Text>
                <Text style={productDescription}>{directorName}</Text>
                <Text style={productDescription}>Ocena: {rating}/10</Text>
              </Column>
              <Column>
                <Text
                  style={{
                    ...text,
                    lineHeight: "16px",
                    fontSize: "12px",
                    margin: 0,
                    fontWeight: "bold",
                  }}
                >
                  Data rozpoczęcia wynajmu:
                </Text>
                <Text
                  style={{
                    ...text,
                    lineHeight: "16px",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  {rentStartDate}
                </Text>
                <Text
                  style={{
                    ...text,
                    lineHeight: "16px",
                    fontSize: "12px",
                    margin: 0,
                    fontWeight: "bold",
                  }}
                >
                  Data zakończenia wynajmu:
                </Text>
                <Text
                  style={{
                    ...text,
                    lineHeight: "16px",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  {rentEndDate}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />
          <Text style={text}>
            Klikając w link poniżej możesz przejść do dedykowanej strony ze
            statusem zamówienia. Tam też będziesz mógł pobrac dokument EDI
            potwierdzający dokonaną transakcję.
          </Text>
          <Button style={button} href={rentStatusLink}>
            Status wypożyczenia
          </Button>
          <Text style={text}>
            Po upływanie daty zakończenia najmu, film nie będzie dłużej możliwy
            do oglądania.
          </Text>
          <Text style={{ ...text, color: "#404040", paddingBottom: "48px" }}>
            Jeżeli nie korzystałeś z naszej platformy, a wiadomość wydaje Ci się
            nie związana z twoimi ostatnimi akcjami, prosimy o usunięcie
            wiadomość i kontakt z zespołem cineEDI. Mogło dość do nadużyć z
            wykorzystaniem twojego adresu mailowego.
          </Text>
          <Text style={{ ...text, margin: 0 }}>Miłego seansu życzy,</Text>
          <Text style={{ ...text, margin: 0 }}>Zespół CineEDI!</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

RentStartEmail.PreviewProps = {
  rentStatusLink: "https://cineedi.com/rent-status/1",
  movieTitle: "Pulp Fiction",
  directorName: "Quentin Tarantino",
  rating: "8.6",
  userName: "Jan Kowalski",
  rentStartDate: "01.05.2024, godz. 20:20",
  rentEndDate: "02.05.2024, godz. 20:20",
  imageUrl:
    "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_QL75_UY562_CR3,0,380,562_.jpg",
} as RentStartEmailProps;

export default RentStartEmail;

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

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
  objectFit: "fill" as const,
};

const productTitle = {
  fontSize: "14px",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontWeight: "600",
  color: "#fff",
  margin: "0",
};

const productDescription = {
  fontSize: "12px",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  color: "rgb(102,102,102)",
  margin: "0",
  lineHeight: "18px",
};
