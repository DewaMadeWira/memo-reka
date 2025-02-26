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
    footer: {
        height: 130,
        width: "100%",
        position: "absolute",
        bottom: 0,
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
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            paddingLeft: 25,
                        }}
                    >
                        <View style={styles.section_identity}>
                            <Text>Tanggal </Text>
                            <Text>:</Text>
                        </View>
                        <Text style={{ fontSize: 11 }}>26 Februari 2025</Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            paddingLeft: 25,
                        }}
                    >
                        <View style={styles.section_identity}>
                            <Text>Nomor</Text>
                            <Text>:</Text>
                        </View>
                        <Text style={{ fontSize: 11 }}>
                            171.21/REKA/GEN/QMSHE-TI/X/2024
                        </Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            paddingLeft: 25,
                        }}
                    >
                        <View style={styles.section_identity}>
                            <Text>Perihal</Text>
                            <Text>:</Text>
                        </View>
                        <Text style={{ fontSize: 11 }}>
                            Permintaan Fasilitas Teknologi Informasi
                        </Text>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                            marginBottom: 10,
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                borderTop: "2px",
                                borderBottom: "2px",
                                borderColor: "black",
                                width: "90%",
                                height: 40,
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <View
                                style={{
                                    width: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    borderRight: "2px",
                                }}
                            >
                                <Text style={{ fontSize: 11, paddingLeft: "10px" }}> 
                                    Dari : QMSHETI
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{ fontSize: 11, paddingLeft: "10px" }}
                                >
                                    Kepada Yth. General Affair
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 30,
                        }}
                    >
                        <View
                            style={{
                                // paddingLeft: 45,
                                width: "80%",
                                fontSize: 11.5,
                            }}
                        >
                            <Text style={{}}>Dengan Hormat,</Text>
                            <Text style={{ marginVertical: 10 }}>
                                Berdasarkan kegiatan Preventive Maintenance
                                fasilitas TI maka Teknologi Informasi
                                membutuhkan kebutuhan sebagai berikut:
                            </Text>
                            <Text>
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Veritatis totam ducimus quasi
                                tenetur excepturi harum minus, sapiente
                                doloremque fugiat itaque rem impedit saepe omnis
                                ipsam odit hic mollitia porro quis vel obcaecati
                                quos assumenda facilis officia! Ducimus modi
                                amet odio accusamus unde deserunt, aspernatur
                                quas id sequi, fugiat natus cumque.
                            </Text>
                            <Text style={{ marginVertical: 10 }}>
                                Maka bersama memo ini kami memohon agar dapat
                                dilakukan pengadaan kebutuhan fasilitas TI
                                tersebut.
                            </Text>
                            <Text style={{ marginVertical: 10 }}>
                                Demikian memo ini kami sampaikan, atas perhatian
                                dan kerjasamanya kami ucapkan terima kasih.
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 150,
                            // backgroundColor: "red",
                            right: 50,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems:"center"
                        }}
                    >
                        <Text style={{ fontSize: 12 }}>Hormat Kami,</Text>
                        <Text style={{ fontSize: 12 }}>M QMSHETI</Text>
                        <Text
                            style={{
                                fontSize: 12,
                                textDecoration: "underline",
                                marginTop: 70,
                            }}
                        >
                            Hisyam Syafiq A
                        </Text>
                    </View>
                    <Image
                        style={styles.footer}
                        src="assets/images/footer_reka.jpg"
                    ></Image>
                </Page>
            </Document>
        </PDFViewer>
    );
}

