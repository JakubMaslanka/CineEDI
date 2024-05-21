import EDI from "rdpcrystal-edi-library";

interface EDIDetails {
  userName: string;
  userEmail: string;
  movieTitle: string;
  movieDirector: string;
  movieRate: string;
  rentalStartDate: string;
  rentalEndDate: string;
}

export const generateEDIfile = ({
  userName,
  userEmail,
  movieTitle,
  movieDirector,
  movieRate,
  rentalStartDate,
  rentalEndDate,
}: EDIDetails): string => {
  const STAR = 42; //'*'
  const COLON = 58; //':'
  const TILDA = 126; //'~'

  const doc = new EDI.EDILightWeightDocument();

  doc.Delimiters.ElementTerminatorCharacter = STAR;
  doc.Delimiters.CompositeTerminatorCharacter = COLON;
  doc.Delimiters.SegmentTerminatorCharacter = TILDA;

  doc.AutoPlaceCorrectNumOfSegments = true;
  doc.EachSegmentInNewLine = true;

  // Interchange Header
  const interchangeLoop = doc.createLoop("Interchange header");
  const isa = interchangeLoop.createSegment("ISA");
  isa.addElement("00");
  isa.addElement(" ");
  isa.addElement("00");
  isa.addElement(" ");
  isa.addElement("ZZ");
  isa.addElement("InterchangeSenderID");
  isa.addElement("ZZ");
  isa.addElement("InterchangeReceiverID");
  isa.addElement("070303");
  isa.addElement("1804");
  isa.addElement("U");
  isa.addElement("00401");
  isa.addElement("1");
  isa.addElement("1");
  isa.addElement("T");
  isa.addElement(":");

  // Functional Group
  const functionalGroup = interchangeLoop.createLoop("FunctionalGroup");
  const gs = functionalGroup.createSegment("GS");

  gs.addElement("SH");
  gs.addElement("cineEDI.online");
  gs.addElement("ApplicationReceiverCode");
  gs.addElement("2023");
  gs.addElement("132334");
  gs.addElement("1");
  gs.addElement("X");
  gs.addElement("004010");

  // Transaction Header
  const transaction = functionalGroup.createLoop("Transaction Header");
  const st = transaction.createSegment("ST");
  st.addElement("810");
  st.addElement("123");
  st.addElement("005010X222A1");

  // Begin Transaction
  const beginTransaction = transaction.createLoop("BeginTransaction");

  // Institution Details
  const institution = beginTransaction.createSegment("N1");
  institution.addElement("ST");
  institution.addElement("cineEDI.online");
  institution.addElement("92");
  institution.addElement("f6ed30f2-342f-4215-88b7-354d7d5d3988");

  const institutionAddress = beginTransaction.createSegment("N3");
  institutionAddress.addElement("ul. Chmielna 20");

  const institutionCity = beginTransaction.createSegment("N4");
  institutionCity.addElement("Warszawa");
  institutionCity.addElement("00-020");

  const institutionEmail = beginTransaction.createSegment("PER");
  institutionEmail.addElement("EM");
  institutionEmail.addElement("no-replay@cineedi.online");

  // Client Details
  const client = beginTransaction.createSegment("N1");
  client.addElement("BY");
  client.addElement(userName);
  client.addElement("EM");
  client.addElement(userEmail);

  // Rental Details
  const rental = beginTransaction.createSegment("LIN");
  rental.addElement("1");
  rental.addElement("Rental");
  rental.addElement(
    `Kr\u00F3tkoterminowe wypo\u017Cyczone filmu ${movieTitle}`
  );
  rental.addElement(movieDirector);
  rental.addElement(movieRate);
  rental.addElement(rentalStartDate);
  rental.addElement(rentalEndDate);

  // Transaction Trailer
  const se = transaction.createSegment("SE");
  se.addElement("0");
  se.addElement("123");

  // End Functional Group
  const endFunctionalGroup = functionalGroup.createLoop("EndFunctionalGroup");
  const ge = endFunctionalGroup.createSegment("GE");
  ge.addElement("1");
  ge.addElement("1");

  // End Interchange
  const endInterchange = interchangeLoop.createLoop("EndInterchange");
  const iea = endInterchange.createSegment("IEA");
  iea.addElement("1");
  iea.addElement("1");

  return doc.generateEDIData();
};
