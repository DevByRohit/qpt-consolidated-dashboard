import { View, Text } from "@react-pdf/renderer";
import styles from "../pdf/styles";

const MaterialTable = ({ materials }) => {
  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.tableRow, styles.tableHeader]} fixed>
        <View style={[styles.cell, { width: "6%" }]}>
          <Text style={[styles.headerCell, styles.center]}>S.No</Text>
        </View>

        <View style={[styles.cell, { width: "48%" }]}>
          <Text style={styles.headerCell}>Material Name</Text>
        </View>

        <View style={[styles.cell, { width: "10%" }]}>
          <Text style={[styles.headerCell, styles.center]}>Unit</Text>
        </View>

        <View style={[styles.cell, { width: "12%" }]}>
          <Text style={[styles.headerCell, styles.center]}>Qty/Unit</Text>
        </View>

        <View style={[styles.cell, { width: "12%" }]}>
          <Text style={[styles.headerCell, styles.center]}>Required</Text>
        </View>

        <View
          style={[
            styles.cell,
            {
              width: "12%",
              borderRightWidth: 0,
            },
          ]}
        >
          <Text style={[styles.headerCell, styles.center]}>Issued</Text>
        </View>
      </View>

      {/* Rows */}
      {materials.map((item, index) => (
        <View key={index} style={styles.tableRow} wrap={false}>
          <View style={[styles.cell, { width: "6%" }]}>
            <Text style={styles.center}>{item.sno}</Text>
          </View>

          <View style={[styles.cell, { width: "48%" }]}>
            <Text>{item.material_name}</Text>
          </View>

          <View style={[styles.cell, { width: "10%" }]}>
            <Text style={styles.center}>{item.unit}</Text>
          </View>

          <View style={[styles.cell, { width: "12%" }]}>
            <Text style={styles.center}>{item.qty_per_unit}</Text>
          </View>

          <View style={[styles.cell, { width: "12%" }]}>
            {/* <Text style={styles.center}>{item.required_qty}</Text> */}
            <Text style={styles.center}>
              {Number.isInteger(Number(item.required_qty))
                ? Number(item.required_qty)
                : Number(item.required_qty).toFixed(2)}
            </Text>
          </View>

          <View
            style={[
              styles.cell,
              {
                width: "12%",
                borderRightWidth: 0,
              },
            ]}
          >
            <Text style={styles.center}>{item.issued_qty || ""}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default MaterialTable;
