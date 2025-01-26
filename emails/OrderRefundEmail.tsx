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

const OrderRefundEmail = ({
  email = "N/A",
  createdAt = new Date(),
  razorpayPaymentId = "N/A",
  orderId = "N/A",
  previewUrl = `${baseUrl}/default-product-image.png`,
  name = "Product Name",
  description = "Product Description",
  amount = 0,
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
    <Preview>ChitraSetu Order Refund Notification</Preview>

    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section>
          <Row>
            <Column>
              <Img
                src={`${baseUrl}/_next/image?url=%2Flogo.png&w=128&q=75`}
                width="42"
                height="42"
                alt="SnapTrade Logo - Order Refund Notification"
              />
            </Column>
            <Column align="right" style={tableCell}>
              <Text style={heading}>Refund Processed</Text>
            </Column>
          </Row>
        </Section>

        {/* Refund Information */}
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
                    <Text style={informationTableLabel}>REFUND DATE</Text>
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
                    <Text style={informationTableValue}>
                      {razorpayPaymentId}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>

        {/* Product Details */}
        <Section style={productTitleTable}>
          <Text style={productsTitle}>Refund Details</Text>
        </Section>

        <Section>
          <Row>
            <Column style={{ width: "64px" }}>
              <Img
                src={previewUrl}
                width="64"
                height="64"
                alt={`Image of ${name}`}
                style={productIcon}
              />
            </Column>
            <Column style={{ paddingLeft: "22px" }}>
              <Text style={productTitle}>{name}</Text>
              <Text style={productDescription}>{description}</Text>
            </Column>

            <Column style={productPriceWrapper} align="right">
              <Text style={productPrice}>Rs {(amount / 100).toFixed(2)}</Text>
            </Column>
          </Row>
        </Section>

        {/* Refund Summary */}
        <Hr style={productPriceLine} />
        <Section align="right">
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>TOTAL REFUND</Text>
            </Column>
            <Column style={productPriceVerticalLine} />
            <Column style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>
                Rs {(amount / 100).toFixed(2)}
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr style={productPriceLineBottom} />

        {/* Footer */}
        <Section>
          <Row>
            <Column>
              <Text style={footerText}>
                Your refund has been successfully processed. It may take 5-7
                business days to reflect in your account. If you have any
                questions, please contact our support team.
              </Text>
            </Column>
          </Row>
        </Section>

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

export default OrderRefundEmail;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
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
  color: "#888888",
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
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  paddingLeft: "10px",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
};

const productTitle = { fontSize: "12px", fontWeight: "600", ...resetText };

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,
};

const productPriceTotal = {
  margin: "0",
  color: "rgb(102,102,102)",
  fontSize: "10px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right" as const,
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productPriceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap" as const,
  textAlign: "right" as const,
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLine = { margin: "30px 0 0 0" };

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const productPriceLargeWrapper = { display: "table-cell", width: "90px" };

const productPriceLineBottom = { margin: "0 0 75px 0" };

const block = { display: "block" };

const footerText = {
  fontSize: "12px",
  color: "#666",
  textAlign: "center" as const,
};
