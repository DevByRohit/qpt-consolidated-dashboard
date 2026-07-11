import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // =========================
  // PAGE
  // =========================
  page: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#000",
    backgroundColor: "#FFFFFF",
  },

  // =========================
  // TITLE
  // =========================
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },

  // =========================
  // HEADER
  // =========================
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },

  column: {
    flex: 1,
  },

  label: {
    fontWeight: "bold",
  },

  value: {
    fontWeight: "normal",
  },

  // =========================
  // TABLE
  // =========================
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 8,
  },

  tableRow: {
    flexDirection: "row",
  },

  tableHeader: {
    backgroundColor: "#E5E7EB",
  },

  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 2,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  headerCell: {
    fontWeight: "bold",
  },

  center: {
    textAlign: "center",
  },

  right: {
    textAlign: "right",
  },

  // =========================
  // SIGNATURE
  // =========================
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },

  signatureBox: {
    width: "30%",
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 5,
    textAlign: "center",
  },
});

export default styles;
