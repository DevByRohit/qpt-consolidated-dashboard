import { Page, View, Text } from "@react-pdf/renderer";
import styles from "../pdf/styles";
import SummaryPage from "./SummaryPage";

const TrackingPage = () => {
  const rows = Array.from({ length: 10 });

  return (
    <Page size="A4" style={styles.page}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 8,
        }}
      >
        PRODUCTION & REJECTION TRACKING
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#000",
        }}
      >
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.cell, { width: "18%" }]}>
            <Text style={[styles.headerCell, styles.center]}>Date</Text>
          </View>

          <View style={[styles.cell, { width: "15%" }]}>
            <Text style={[styles.headerCell, styles.center]}>
              Produced Qty
            </Text>
          </View>

          <View style={[styles.cell, { width: "15%" }]}>
            <Text style={[styles.headerCell, styles.center]}>
              Rejected Qty
            </Text>
          </View>

          <View style={[styles.cell, { width: "15%" }]}>
            <Text style={[styles.headerCell, styles.center]}>
              Accepted Qty
            </Text>
          </View>

          <View
            style={[
              styles.cell,
              {
                width: "37%",
                borderRightWidth: 0,
              },
            ]}
          >
            <Text style={[styles.headerCell, styles.center]}>
              Reason for Rejection
            </Text>
          </View>
        </View>

        {/* Empty Rows */}
        {rows.map((_, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, { width: "18%", height: 20 }]}>
              <Text />
            </View>

            <View style={[styles.cell, { width: "15%" }]}>
              <Text />
            </View>

            <View style={[styles.cell, { width: "15%" }]}>
              <Text />
            </View>

            <View style={[styles.cell, { width: "15%" }]}>
              <Text />
            </View>

            <View
              style={[
                styles.cell,
                {
                  width: "37%",
                  borderRightWidth: 0,
                },
              ]}
            >
              <Text />
            </View>
          </View>
        ))}
      </View>

      <SummaryPage />
    </Page>
  );
};

export default TrackingPage;
