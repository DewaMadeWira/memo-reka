import React, { useState } from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    Image,
    pdf,
} from "@react-pdf/renderer";
import { router } from "@inertiajs/react";
import Template from "./Template";

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

export default function Index({ data }: { data: any }) {
    const [values, setValues] = useState<{ file: File | undefined }>({
        file: undefined,
    });
    const [pdfDoc, setPdfDoc] = useState<JSX.Element | null>(null);
    const generateAndSendPDF = async () => {
        try {
            const blob = await pdf(<Template data={data}></Template>).toBlob();

            const formData = new FormData();
            formData.append("pdf", blob, "memo.pdf");

            router.post("/upload", formData, {
                preserveScroll: true,
                // onSuccess: () => alert("PDF uploaded successfully!"),
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <div className="">
            <PDFViewer className="w-full h-[80vh]">
                <Template data={data} />
            </PDFViewer>
            <button onClick={generateAndSendPDF}>Submit</button>
        </div>
    );
}
