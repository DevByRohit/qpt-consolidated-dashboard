import { Document, Page } from "@react-pdf/renderer";

import styles from "./styles";

import Header from "../pdf-sections/Header";
import MaterialTable from "../pdf-sections/MaterialTable";
import TrackingPage from "../pdf-sections/TrackingPage";

const JobCardPDF = ({ jobCard }) => {
  return (
    <Document>
      {/* Page 1 */}
      <Page size="A4" style={styles.page}>
        <Header jobCard={jobCard} />

        <MaterialTable materials={jobCard.materials} />
      </Page>

      {/* Page 2 */}
      <TrackingPage />
    </Document>
  );
};

export default JobCardPDF;
