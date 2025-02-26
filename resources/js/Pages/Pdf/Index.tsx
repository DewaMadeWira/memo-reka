import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
    },
    section: {
        margin: 10,
        padding: 10,
        fontSize: 25,
        textAlign: "center",
    },
    section_identity: {
        paddingLeft: 20,
        paddingBottom: 5,
        fontSize: 12,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "20%",

        // textAlign: "center",
    },
    header: {
        height: 80,
        width: "100%",
    },
});

export default function Index() {
    return (
        <PDFViewer className="w-full h-screen">
            <Document>
                <Page size="A4" style={styles.page}>
                    <Image
                        style={styles.header}
                        src="assets/images/header_all.jpg"
                    />
                    <View style={styles.section}>
                        <Text>MEMO</Text>
                    </View>
                    <View style={styles.section_identity}>
                        <Text>Section #2</Text>
                        <Text>:</Text>
                    </View>
                    <View style={styles.section_identity}>
                        <Text>Section #2</Text>
                        <Text>:</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
}
