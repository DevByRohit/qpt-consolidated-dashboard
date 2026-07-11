import { View, Text } from "@react-pdf/renderer";
import styles from "../pdf/styles";

const Header = ({ jobCard }) => {
  return (
    <>
      {/* Company Name */}
      <Text style={styles.title}>QUALITEX POWER TOOLS</Text>

      {/* Document Title */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        JOB CARD
      </Text>

      {/* Row 1 */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>Job Card No : </Text>
            {jobCard.job_card_no}
          </Text>
        </View>

        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>Date : </Text>
            {jobCard.date}
          </Text>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>FG Name : </Text>
            {jobCard.product_name}
          </Text>
        </View>

        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>FG Code : </Text>
            {jobCard.fg_code}
          </Text>
        </View>
      </View>

      {/* Row 3 */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>Planned Qty : </Text>
            {jobCard.planned_qty} {jobCard.unit}
          </Text>
        </View>

        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>Total Materials : </Text>
            {jobCard.total_materials}
          </Text>
        </View>
      </View>

      {/* Row 4 */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>Supervisor : </Text>
            {jobCard.supervisor_name}
          </Text>
        </View>

        <View style={styles.column}>
          <Text>
            <Text style={styles.label}>Storekeeper : </Text>
            {jobCard.storekeeper_name}
          </Text>
        </View>
      </View>
    </>
  );
};

export default Header;
