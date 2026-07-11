import { View, Text } from "@react-pdf/renderer";
import styles from "../pdf/styles";

const SummaryPage = () => {
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      {/* Heading */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 8,
        }}
      >
        PRODUCTION SUMMARY
      </Text>

      {/* Summary Table */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#000",
        }}
      >
        {/* Header */}
        <View
          style={[
            styles.tableRow,
            {
              backgroundColor: "#f3f4f6",
            },
          ]}
        >
          <View style={[styles.cell, { width: "25%" }]}>
            <Text style={[styles.headerCell, styles.center]}>Description</Text>
          </View>

          <View
            style={[
              styles.cell,
              {
                width: "15%",
              },
            ]}
          >
            <Text style={[styles.headerCell, styles.center]}>Quantity</Text>
          </View>

          <View
            style={[
              styles.cell,
              {
                width: "60%",
                borderRightWidth: 0,
              },
            ]}
          >
            <Text style={[styles.headerCell, styles.center]}>Remarks</Text>
          </View>
        </View>

        {[
          "Planned Quantity",
          "Produced Quantity",
          "Rejected Quantity",
          "Accepted Quantity",
          "Balance Quantity",
        ].map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, { width: "25%", height: 20 }]}>
              <Text>{item}</Text>
            </View>

            <View
              style={[
                styles.cell,
                {
                  width: "15%",
                },
              ]}
            >
              <Text></Text>
            </View>

            <View
              style={[
                styles.cell,
                {
                  width: "60%",
                  borderRightWidth: 0,
                },
              ]}
            >
              <Text></Text>
            </View>
          </View>
        ))}
      </View>

      {/* Signature Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 50,
        }}
      >
        <View
          style={{
            width: "30%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              borderTopWidth: 1,
              borderColor: "#000",
              marginBottom: 5,
            }}
          />
          <Text>Supervisor</Text>
        </View>

        <View
          style={{
            width: "30%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              borderTopWidth: 1,
              borderColor: "#000",
              marginBottom: 5,
            }}
          />
          <Text>Storekeeper</Text>
        </View>

        <View
          style={{
            width: "30%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              borderTopWidth: 1,
              borderColor: "#000",
              marginBottom: 5,
            }}
          />
          <Text>Production Manager</Text>
        </View>
      </View>
    </View>
  );
};

export default SummaryPage;
