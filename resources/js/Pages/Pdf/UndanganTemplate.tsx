import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import headerImage from "/public/assets/images/header_all.jpg";
import footerImage from "/public/assets/images/footer_reka.jpg";
import { Invitation } from "@/types/InvitationType";
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
    },
    section: {
        margin: 10,
        padding: 10,
        paddingRight: 25,
        fontSize: 11,
        textAlign: "right",
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
const formatDate = (dateString: string, isHeader: boolean) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
    ];
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    if (isHeader) {
        return `${day}, ${dateNum} ${month} ${year}`;
    }
    return `${day} / ${dateNum} ${month} ${year}`;
};

export default function UndanganTemplate({ data }: { data: any }) {
    console.log(data);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={styles.header} src={headerImage} />
                <View style={styles.section}>
                    <Text>{formatDate(data.created_at, true)}</Text>
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
                        {data.invitation_number}
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
                    <Text style={{ fontSize: 11 }}>{data.perihal}</Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        paddingLeft: 25,
                    }}
                >
                    <View
                        style={{
                            paddingLeft: 20,
                            paddingBottom: 5,
                            fontSize: 12,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width: "100%",
                            fontFamily: "Helvetica-Bold",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                marginTop: 20,
                                fontWeight: "bold",
                            }}
                        >
                            Kepada Yth.
                        </Text>
                        <View
                            style={{
                                marginTop: 5,
                                paddingLeft: 15,
                                width: "100%",
                            }}
                        >
                            {data.attendees.map((user: any, index: number) => (
                                <Text
                                    style={{
                                        fontSize: 11,
                                        marginTop: 5,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {/* {index + 1}. {user.user.name} */}
                                    {index + 1}. {user.user.nama_pengguna}
                                </Text>
                            ))}
                            {/* <Text
                                style={{
                                    fontSize: 11,
                                    marginTop: 5,
                                    fontWeight: "bold",
                                }}
                            >
                                2. Manager Siang
                            </Text> */}
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 20,
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            fontSize: 11,
                        }}
                    >
                        <Text style={{ marginBottom: 10 }}>Dengan Hormat,</Text>
                        <Text>{data.content}</Text>

                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                                marginTop: 10,
                            }}
                        >
                            <View
                                style={{
                                    paddingBottom: 5,
                                    fontSize: 11,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "20%",
                                }}
                            >
                                <Text>Hari / Tanggal</Text>
                                <Text>:</Text>
                            </View>
                            <Text style={{ fontSize: 11 }}>
                                {formatDate(data.hari_tanggal, false)}
                            </Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                                marginTop: 1,
                            }}
                        >
                            <View
                                style={{
                                    paddingBottom: 5,
                                    fontSize: 11,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "20%",
                                }}
                            >
                                <Text>Waktu</Text>
                                <Text>:</Text>
                            </View>
                            <Text style={{ fontSize: 11 }}>{data.waktu}</Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                                marginTop: 1,
                            }}
                        >
                            <View
                                style={{
                                    paddingBottom: 5,
                                    fontSize: 11,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "20%",
                                }}
                            >
                                <Text>Tempat</Text>
                                <Text>:</Text>
                            </View>
                            <Text style={{ fontSize: 11 }}>{data.tempat}</Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                                marginTop: 1,
                            }}
                        >
                            <View
                                style={{
                                    paddingBottom: 5,
                                    fontSize: 11,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "20%",
                                }}
                            >
                                <Text>Agenda</Text>
                                <Text>:</Text>
                            </View>
                            <Text style={{ fontSize: 11 }}>{data.agenda}</Text>
                        </View>

                        <Text style={{ marginVertical: 10 }}>
                            Demikian undangan ini kami sampaikan, atas perhatian
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
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 12 }}>Hormat Kami,</Text>
                    <Text style={{ fontSize: 12 }}>
                        M {data.from_division.division_code}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            textDecoration: "underline",
                            marginTop: 70,
                        }}
                    >
                        {data.signatory.name}
                    </Text>
                </View>
                <Image style={styles.footer} src={footerImage}></Image>
            </Page>
        </Document>
    );
}
