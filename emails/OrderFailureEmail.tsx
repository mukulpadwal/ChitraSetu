import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.API_ENDPOINT;

const OrderFailureEmail = ({
  email,
  createdAt,
  razorpayPaymentId,
  orderId,
  previewUrl,
  name,
  description,
  amount,
}: {
  email: string;
  createdAt: Date;
  razorpayPaymentId: string;
  orderId: string;
  previewUrl: string;
  name: string;
  description: string;
  amount: number;
}) => (
  <Html>
    <Head />
    <Preview>ChitraSetu Order Failed</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section>
          <Row>
            <Column>
              <Img
                src={`${baseUrl}/_next/image?url=%2Flogo.png&w=128&q=75`}
                width="42"
                height="42"
                alt="SnapTrade Logo"
              />
            </Column>

            <Column align="right" style={tableCell}>
              <Text style={heading}>Order Failed</Text>
            </Column>
          </Row>
        </Section>

        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>Email ID</Text>
                    <Link
                      style={{
                        ...informationTableValue,
                        color: "#15c",
                        textDecoration: "underline",
                      }}
                    >
                      {email}
                    </Link>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>INVOICE DATE</Text>
                    <Text style={informationTableValue}>
                      {new Date(createdAt).toLocaleDateString()}
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>ORDER ID</Text>
                    <Link
                      style={{
                        ...informationTableValue,
                        color: "#15c",
                        textDecoration: "underline",
                      }}
                    >
                      {orderId}
                    </Link>
                  </Column>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>
                      Razorpay Payment Id
                    </Text>
                    <Text style={informationTableValue}>{razorpayPaymentId}</Text>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>

        <Section>
          <Text style={failureMessage}>
            We&apos;re sorry! Your order could not be processed. If any payment
            was deducted, it will be automatically refunded to your account
            within 5-7 business days.
          </Text>
        </Section>

        <Section>
          <Row>
            <Column style={{ width: "64px" }}>
              <Img
                src={`${previewUrl}`}
                width="64"
                height="64"
                alt={name}
                style={productIcon}
              />
            </Column>
            <Column style={{ paddingLeft: "22px" }}>
              <Text style={productTitle}>{name}</Text>
              <Text style={productDescription}>{description}</Text>
            </Column>

            <Column style={productPriceWrapper} align="right">
              <Text style={productPrice}>Rs {(amount as number) / 100}</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={productPriceLineBottom} />

        <Section>
          <Row>
            <Column align="center" style={block}>
              &copy; {new Date().getFullYear()} ChitraSetu | All Rights Reserved
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderFailureEmail;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#ff4d4f",
};

const failureMessage = {
  fontSize: "14px",
  color: "#888888",
  margin: "20px 0",
  textAlign: "center" as const,
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
};

const productTitle = { fontSize: "12px", fontWeight: "600" };

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLineBottom = { margin: "0 0 75px 0" };

const block = { display: "block" };
