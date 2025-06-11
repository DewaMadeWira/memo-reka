import { Head, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Official } from "@/types/OfficialType";
import { Division } from "@/types/DivisionType";
import { DataTable } from "./summary/data-table";
import { columns } from "./summary/columns";
import { User } from "@/types/UserType";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Invitation } from "@/types/InvitationType";

export interface UserWithDivision extends User {
    division: Division;
}
export default function Index({
    request,
    official,
    division,
    userData,
    all_user,
    invite,
}: {
    request: any;
    official: Official[];
    division: Division[];
    userData: any;
    all_user: UserWithDivision[];
    invite: Invitation[];
}) {
    const { user } = usePage().props.auth as { user: User };
    const { toast } = useToast();
    console.log(user);
    console.log(all_user);
    console.log(request);
    const [formData, setFormData] = useState({
        invitation_id: null as number | null,
        file: null as File | null,
        request_name: "",
        judul_rapat: "",
        rangkuman_rapat: "",
    });
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);
    const handleSummaryFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check file type
            if (file.type !== "application/pdf") {
                toast({
                    title: "Format File Tidak Valid",
                    description: "Hanya file PDF yang diperbolehkan",
                    variant: "destructive",
                });
                e.target.value = ""; // Clear the input
                return;
            }

            // Check file size (e.g., 10MB = 10 * 1024 * 1024 bytes)
            const maxSize = 2 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                toast({
                    title: "File Terlalu Besar",
                    description: `Ukuran file maksimal adalah ${
                        maxSize / (1024 * 1024)
                    }MB. File Anda berukuran ${(
                        file.size /
                        (1024 * 1024)
                    ).toFixed(2)}MB`,
                    variant: "destructive",
                });
                e.target.value = ""; // Clear the input
                return;
            }

            setFormData({
                ...formData,
                file: file,
            });

            // Create object URL for PDF preview
            const fileUrl = URL.createObjectURL(file);
            setPdfPreview(fileUrl);
        }
    };
    const validateFormData = () => {
        const errors: string[] = [];

        if (!formData.request_name.trim()) {
            errors.push("Nama Permintaan Persetujuan");
        }
        if (!formData.judul_rapat.trim()) {
            errors.push("Judul Rapat");
        }
        if (!formData.rangkuman_rapat.trim()) {
            errors.push("Rangkuman Rapat");
        }
        if (!formData.invitation_id) {
            errors.push("Undangan Rapat");
        }
        if (!formData.file) {
            errors.push("File Risalah Rapat");
        }

        return errors;
    };
    const handleEmptyInputValidation = () => {
        const emptyFields = validateFormData();

        if (emptyFields.length > 0) {
            toast({
                title: "Peringatan",
                description: `Harap lengkapi field berikut: ${emptyFields.join(
                    ", "
                )}`,
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const handleSummarySubmit = (invitationId: number) => {
        console.log(formData);
        if (!handleEmptyInputValidation()) {
            return;
        }

        // Create a proper FormData object
        // const data = new FormData();

        // if (formData.file) {
        //     data.append("file", formData.file);
        // }
        // data.append("invitation_id", formData.invitation_id?.toString() || "");
        // data.append("request_name", formData.request_name);
        // data.append("judul_rapat", formData.judul_rapat);
        // data.append("rangkuman_rapat", formData.rangkuman_rapat);

        // console.log(data);o

        router.post("/request?intent=summary.create", formData, {
            forceFormData: true,
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan!",
                    description: errors.message,
                    variant: "destructive",
                });
                console.log(errors);
            },
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil!",
                    description: "Risalah Rapat berhasil diunggah",
                });
                setFormData({
                    invitation_id: null,
                    file: null,
                    request_name: "",
                    judul_rapat: "",
                    rangkuman_rapat: "",
                });
                router.visit(window.location.pathname, {
                    preserveScroll: true,
                });
            },
        });
    };

    function handleApprove(id: number) {
        router.put("/request/" + id + "?intent=summary.approve");
    }
    function handleReject(id: number, rejectionReason: string) {
        router.put("/request/" + id + "?intent=summary.reject", {
            rejection_reason: rejectionReason,
        });
    }
    function handleUpdate(id: number) {
        console.log("Original file object:", formData.file);

        // Create a proper FormData object
        const data = new FormData();
        if (formData.file) {
            data.append("file", formData.file);
            data.append("judul_rapat", formData.judul_rapat);
            data.append("rangkuman_rapat", formData.rangkuman_rapat);

            // Better debugging to confirm the file was appended
            console.log("File name:", formData.file.name);
            console.log("File size:", formData.file.size);

            // You can iterate over the FormData entries to see what's actually in it
            // This is the correct way to check FormData contents
            for (let pair of data.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }
        } else {
            console.error("No file to upload!");
            return; // Don't proceed if there's no file
        }

        router.post("/risalah-rapat/update/" + id, data, {
            forceFormData: true,
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan !",
                    description: errors.message,
                    variant: "destructive",
                });
                console.log(errors);
            },
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Risalah Rapat berhasil diubah",
                });
                router.visit(window.location.pathname, {
                    preserveScroll: true,
                });
            },
        });
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [visibleUsers, setVisibleUsers] = useState(2);
    const [filteredUsers, setFilteredUsers] = useState<UserWithDivision[]>([]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <SidebarAuthenticated>
            <Head title="Risalah Rapat" />
            <div className="w-full p-10 bg-white">
                <Breadcrumb className="mb-6">
                    {/* <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Manajemen Divisi</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList> */}
                </Breadcrumb>
                <div className="flex justify-between items-center">
                    <div className="">
                        <h1 className="text-2xl font-semibold">
                            Risalah Rapat
                        </h1>
                        <h1 className="text-xl font-medium mt-2">
                            Divisi : {userData.division.division_name}
                        </h1>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger
                            className={`bg-blue-500 p-2 mt-2 text-white text-sm font-medium rounded-lg ${
                                user.role_id == 1 ? "hidden" : ""
                            }`}
                        >
                            Unggah Risalah Rapat
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <ScrollArea className="h-[500px] pr-3">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="font-medium">
                                        Unggah Risalah Rapat
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Pilih undangan rapat dan unggah file
                                        risalah rapat
                                    </AlertDialogDescription>
                                    <div className="mt-4">
                                        <label
                                            htmlFor="perihal"
                                            className="block mb-2"
                                        >
                                            Nama Permintaan Persetujuan
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="request_name"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="judul_rapat"
                                            className="block mb-2 mt-4"
                                        >
                                            Judul Rapat
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="judul_rapat"
                                            id="judul_rapat"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="rangkuman_rapat"
                                            className="block mb-2 mt-4"
                                        >
                                            Rangkuman Rapat
                                        </label>
                                        <textarea
                                            onChange={handleChange}
                                            name="rangkuman_rapat"
                                            id="rangkuman_rapat"
                                            rows={4}
                                            className="w-full p-2 border rounded-lg"
                                        ></textarea>
                                        <label
                                            htmlFor="invitation_id"
                                            className="block mb-2 mt-4"
                                        >
                                            Undangan Rapat
                                        </label>
                                        <select
                                            id="invitation_id"
                                            className="w-full p-2 border rounded-lg"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    invitation_id: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            value={formData.invitation_id || ""}
                                        >
                                            <option value="">
                                                Pilih Undangan Rapat
                                            </option>
                                            {invite.map((req: any) => (
                                                <option
                                                    key={req.id}
                                                    value={req.invite.id}
                                                >
                                                    {req.request_name}
                                                </option>
                                            ))}
                                        </select>
                                        <label
                                            htmlFor="file"
                                            className="block mb-2 mt-4"
                                        >
                                            File Risalah Rapat
                                        </label>
                                        <input
                                            type="file"
                                            id="file"
                                            accept="application/pdf"
                                            className="w-full p-2 border rounded-lg"
                                            onChange={handleSummaryFileChange}
                                        />
                                        {formData.file && (
                                            <div className="mt-2 text-sm text-green-600">
                                                File selected:{" "}
                                                {formData.file.name}
                                            </div>
                                        )}
                                        {pdfPreview && (
                                            <div className="mt-4 border rounded">
                                                <div className="text-sm font-medium p-2 bg-gray-50">
                                                    Preview PDF
                                                </div>
                                                <div
                                                    style={{ height: "400px" }}
                                                >
                                                    <embed
                                                        src={pdfPreview}
                                                        type="application/pdf"
                                                        width="100%"
                                                        height="100%"
                                                        className="border"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </AlertDialogHeader>
                            </ScrollArea>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-green-500 font-normal hover:bg-green-600"
                                    onClick={() => {
                                        if (handleEmptyInputValidation()) {
                                            handleSummarySubmit(
                                                formData.invitation_id!
                                            );
                                        }
                                    }}
                                >
                                    Unggah Risalah
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="mt-8">
                    <DataTable
                        user={user}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                        data={request}
                        columns={columns}
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        handleUpdate={handleUpdate}
                        handleUpload={function (id: number): void {
                            throw new Error("Function not implemented.");
                        }}
                        setFilePreview={function (
                            value: React.SetStateAction<string | null>
                        ): void {
                            throw new Error("Function not implemented.");
                        }}
                        handleSummaryFileChange={handleSummaryFileChange}
                        setFileData={function (
                            value: React.SetStateAction<{
                                file: File | null;
                                memo_id: number;
                                fileName: string;
                            } | null>
                        ): void {
                            throw new Error("Function not implemented.");
                        }}
                        filePreview={null}
                        fileData={null}
                        official={official}
                        division={division}
                        pdfPreview={pdfPreview}
                        judul_rapat={formData.judul_rapat}
                        rangkuman_rapat={formData.rangkuman_rapat}
                    />
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
