import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
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
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { ArrowRight } from "lucide-react";
import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import { DataTable } from "./memo/data-table";
import { columns } from "./memo/columns";
import { User } from "@/types/UserType";
import { Official } from "@/types/OfficialType";
import { useToast } from "@/hooks/use-toast";
import { Memo } from "@/types/MemoType";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function Index({
    request,
    division,
    userData,
    official,
    notifications,
    memo_division,
}: // stages,
{
    request: any;
    division: any;
    userData: any;
    official: Official[];
    notifications: any;
    memo_division: any;
    // stages: any;
}) {
    const { toast } = useToast();
    console.log(userData);
    console.log(memo_division);
    // console.log(request[0].memo);
    // console.log(stages);
    const [formData, setFormData] = useState({
        request_name: "",
        perihal: "",
        content: "",
        official: "",
        to_division: null,
        previous_memo: null,
    });
    const [fileData, setFileData] = useState<{
        files: File[];
        memo_id: number;
        fileNames: string[];
    } | null>(null);

    const [filePreview, setFilePreview] = useState<string[]>([]);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const handleFileUpload = () => {
        if (!fileData?.files || fileData.files.length === 0) return;

        // Validate file sizes
        let totalSize = 0;
        const oversizedFiles: string[] = [];

        fileData.files.forEach((file) => {
            totalSize += file.size;
            if (file.size > MAX_FILE_SIZE) {
                oversizedFiles.push(
                    `${file.name} (${(file.size / (1024 * 1024)).toFixed(
                        2
                    )} MB)`
                );
            }
        });

        // Check if any files are too large
        if (oversizedFiles.length > 0) {
            toast({
                title: "Files too large!",
                description: `The following files exceed the 10MB limit: ${oversizedFiles.join(
                    ", "
                )}`,
                variant: "destructive",
            });
            return;
        }

        // Check if total size is too large
        if (totalSize > MAX_TOTAL_SIZE) {
            toast({
                title: "Total file size too large!",
                description: `Total size (${(totalSize / (1024 * 1024)).toFixed(
                    2
                )} MB) exceeds the 50MB limit.`,
                variant: "destructive",
            });
            return;
        }

        const formData = new FormData();

        // Append each file to the FormData
        fileData.files.forEach((file) => {
            formData.append("images[]", file);
        });

        formData.append("memo_id", fileData.memo_id.toString());

        setIsUploading(true);
        setUploadProgress(0);

        router.post("/upload-bukti", formData, {
            onBefore: () => setIsUploading(true),
            onProgress: (progress) => {
                if (progress!.percentage) {
                    setUploadProgress(progress!.percentage);
                }
            },
            onError: (errors) => {
                setIsUploading(false);

                // Handle specific error types
                if (
                    errors.message.includes("413") ||
                    errors.message.includes("Request Entity Too Large")
                ) {
                    toast({
                        title: "Files too large for server!",
                        description:
                            "The server rejected your upload because the total size is too large. Please reduce file sizes or contact your administrator.",
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Upload failed!",
                        description: errors.message,
                        variant: "destructive",
                    });
                }
                console.log(errors);
            },
            onSuccess: () => {
                setIsUploading(false);
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil!",
                    description: "File berhasil diupload",
                });
                // Clear previews and file data after successful upload
                setFilePreview([]);
                setFileData(null);
            },
            onFinish: () => setIsUploading(false),
        });
    };
    const handleFileSelection = (files: FileList | null, memo_id: number) => {
        if (!files || files.length === 0) return;

        const fileArray: File[] = Array.from(files);
        const fileNames: string[] = fileArray.map((file) => file.name);

        // Create previews for images
        const newPreviews: string[] = [];

        fileArray.forEach((file) => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newPreviews.push(e.target.result as string);
                        // Update state only after all previews are generated
                        if (newPreviews.length === fileArray.length) {
                            setFilePreview(newPreviews);
                        }
                    }
                };
                reader.readAsDataURL(file);
            } else {
                // For non-image files, use a placeholder or icon
                newPreviews.push("");
                if (newPreviews.length === fileArray.length) {
                    setFilePreview(newPreviews);
                }
            }
        });

        setFileData({
            files: fileArray,
            memo_id,
            fileNames,
        });
    };

    const { user } = usePage().props.auth as { user: User };
    console.log(user);
    console.log(request);
    console.log(request.data);
    const validateMemoFormData = () => {
        const errors: string[] = [];

        if (!formData.request_name?.trim()) {
            errors.push("Nama Permintaan Persetujuan");
        }
        if (!formData.perihal?.trim()) {
            errors.push("Perihal");
        }
        if (!formData.content?.trim()) {
            errors.push("Isi");
        }
        if (!formData.official?.trim()) {
            errors.push("Pejabat");
        }
        if (!formData.to_division) {
            errors.push("Divisi Tujuan");
        }
        // Add other required fields based on your memo form structure

        return errors;
    };
    const handleMemoInputValidation = () => {
        const emptyFields = validateMemoFormData();

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

    const handleSubmit = () => {
        console.log(formData);
        if (!handleMemoInputValidation()) {
            return;
        }
        router.post("/request?intent=memo.create", formData, {
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
                    description: "Memo berhasil dibuat",
                });
                router.visit(window.location.pathname, {
                    preserveScroll: true,
                });
            },
        });
    };
    // const handleApprove = ({ id }: { id: number }) => {
    //     router.post("/memo-approve/" + id);
    // };
    function handleApprove(id: number) {
        router.put("/request/" + id + "?intent=memo.approve");
    }
    function handleReject(id: number, rejectionReason?: string) {
        router.put("/request/" + id + "?intent=memo.reject", {
            rejection_reason: rejectionReason,
        });
    }
    function handleUpdate(id: number) {
        router.put("/memo/" + id, formData, {
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
                    description: "Memo berhasil diubah",
                });
                router.visit(window.location.pathname, {
                    preserveScroll: true,
                });
            },
        });
    }
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    console.log(official);

    return (
        <SidebarAuthenticated>
            <Head title="Memo" />
            <div className="w-full p-10 bg-white">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        {/* <BreadcrumbItem>
                            <BreadcrumbLink href="">Memo</BreadcrumbLink>
                        </BreadcrumbItem> */}
                        {/* <BreadcrumbSeparator /> */}
                        {/* <BreadcrumbItem>
                            <BreadcrumbPage>Memo Divisi</BreadcrumbPage>
                        </BreadcrumbItem> */}
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex justify-between items-center">
                    <div className="">
                        <h1 className="text-2xl font-semibold">Memo</h1>
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
                            Buat Memo
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[300rem]">
                            <ScrollArea className="h-96 ">
                                <AlertDialogHeader className="mx-4">
                                    <AlertDialogTitle className="font-medium">
                                        Buat Memo Baru
                                    </AlertDialogTitle>
                                    <div className="">
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
                                            htmlFor="previous_memo"
                                            className="block mb-2"
                                        >
                                            Nomor Memo Perbaikan
                                        </label>
                                        <div className="flex gap-4 mb-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="is_correction"
                                                    value="no"
                                                    defaultChecked
                                                    onChange={() =>
                                                        setFormData({
                                                            ...formData,
                                                            previous_memo: null,
                                                        })
                                                    }
                                                />
                                                <span>Tidak</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="is_correction"
                                                    value="yes"
                                                    onChange={() => {
                                                        // Set previous_memo to first memo id if available
                                                        if (
                                                            memo_division &&
                                                            memo_division.length >
                                                                0
                                                        ) {
                                                            setFormData({
                                                                ...formData,
                                                                previous_memo:
                                                                    memo_division[0]
                                                                        .memo
                                                                        .id,
                                                            });
                                                        }
                                                    }}
                                                />
                                                <span>Ya</span>
                                            </label>
                                        </div>

                                        {formData.previous_memo !== null && (
                                            <>
                                                <label
                                                    htmlFor="previous_memo"
                                                    className="block mb-2"
                                                >
                                                    Nomor Memo Perbaikan
                                                </label>
                                                {memo_division &&
                                                memo_division.length > 0 ? (
                                                    <select
                                                        name="previous_memo"
                                                        id="previous_memo"
                                                        className="w-full p-2 border rounded-lg"
                                                        value={
                                                            formData.previous_memo ||
                                                            ""
                                                        }
                                                        onChange={handleChange}
                                                    >
                                                        {memo_division.map(
                                                            (item: any) => (
                                                                <option
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    value={
                                                                        item
                                                                            .memo
                                                                            .id
                                                                    }
                                                                >
                                                                    {
                                                                        item
                                                                            .memo
                                                                            .memo_number
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                ) : (
                                                    <p className="text-gray-500 italic">
                                                        Tidak ada memo tersedia
                                                        untuk diperbaiki
                                                    </p>
                                                )}
                                            </>
                                        )}
                                        {/* <select name="previous_memo" id="">
                                        {memo_division.map((item: any) => (
                                            <option
                                                key={item.id}
                                                value={item.memo.id}
                                            >
                                                {item.memo.memo_number}
                                            </option>
                                        ))}
                                    </select> */}
                                        <label
                                            htmlFor="perihal"
                                            className="block mb-2"
                                        >
                                            Perihal
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="perihal"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="content"
                                            className="block mb-2"
                                        >
                                            Isi
                                        </label>
                                        <textarea
                                            onChange={handleChange}
                                            rows={10}
                                            name="content"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="official"
                                            className="block mb-2"
                                        >
                                            Pejabat
                                        </label>
                                        <select
                                            name="official"
                                            id=""
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                        >
                                            <option value="">
                                                Pilih Pejabat
                                            </option>
                                            {official.map((offi) => (
                                                <option value={offi.id}>
                                                    {offi.official_name}
                                                </option>
                                            ))}
                                        </select>
                                        <label
                                            htmlFor="to_division"
                                            className="block mb-2"
                                        >
                                            Divisi Tujuan
                                        </label>
                                        <select
                                            name="to_division"
                                            id=""
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                        >
                                            <option value="">
                                                Pilih Divisi
                                            </option>
                                            {division.map((divi: any) => (
                                                <option value={divi.id}>
                                                    {divi.division_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </AlertDialogHeader>
                            </ScrollArea>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-blue-500 font-normal hover:bg-blue-600"
                                    // onClick={handleSubmit}
                                    onClick={() => {
                                        if (handleMemoInputValidation()) {
                                            handleSubmit();
                                        }
                                    }}
                                >
                                    Buat Memo
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                {/* <div className="flex gap-3">
                    <a
                        href={`/memo`}
                        // onClick={() => router.re}
                        className={`bg-blue-500 p-2 mt-2 text-white rounded-lg
                                        `}
                    >
                        All Memo
                    </a>
                    <a
                        href={`/memo?intent=memo.internal`}
                        // onClick={() => router.re}
                        className={`bg-blue-500 p-2 mt-2 text-white rounded-lg
                                        `}
                    >
                        Memo Internal
                    </a>
                    <a
                        href={`/memo?intent=memo.eksternal`}
                        // onClick={() => router.re}
                        className={`bg-blue-500 p-2 mt-2 text-white rounded-lg
                                        `}
                    >
                        Memo Eksternal
                    </a>
                </div> */}

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
                        setFilePreview={setFilePreview}
                        setFileData={setFileData}
                        filePreview={filePreview}
                        fileData={fileData}
                        handleUpload={handleFileUpload}
                        handleFileSelection={handleFileSelection}
                        handleUpdate={handleUpdate}
                    />
                </div>
                {/*  */}

                {/* <button
                    onClick={handleSubmit}
                    className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                        user.role_id == 1 ? "hidden" : ""
                    }`}
                >
                    Buat Memo
                </button> */}
            </div>
        </SidebarAuthenticated>
    );
}
