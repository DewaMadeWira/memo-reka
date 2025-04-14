import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
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
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { LetterType } from "@/types/LetterTypeType";
import { DataTable } from "./lettertype/data-table";
import { columns } from "./lettertype/columns";

export default function Index({ data }: { data: LetterType[] }) {
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        letter_type_name: "",
    });
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = () => {
        // console.log(formData);
        router.post("/admin/manajemen-tipe-surat", formData, {
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
                    description: "Tipe surat berhasil dibuat",
                });
            },
        });
    };
    const handleDelete = (id: number) => {
        // console.log(formData);
        router.delete(`/admin/manajemen-tipe-surat/${id}`, {
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Tipe surat berhasil dihapus",
                });
            },
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan !",
                    description: errors.message,
                });
            },
        });
    };
    const handleUpdate = (id: number) => {
        // const filteredData = Object.fromEntries(
        //     Object.entries(formData).filter(([_, value]) => value !== "")
        // );

        // console.log(filteredData);
        // // console.log(formData);
        // console.log(id);
        router.put(`/admin/manajemen-tipe-surat/${id}`, formData, {
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
                    description: "Tipe surat berhasil diubah",
                });
            },
        });
    };
    console.log(data);

    return (
        <SidebarAuthenticated>
            <Head title="Manajemen Role" />
            <div className="w-full p-10">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                Manajemen Tipe Surat
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-2xl">Manajemen Tipe Surat</h1>

                <div className="w-full flex justify-end items-center mt-2 gap-5">
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger className="text-black p-2 border border-gray-300 rounded-md w-1/12 text-base">
                            Filter
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                            <DropdownMenuItem>Makan</DropdownMenuItem>
                            <DropdownMenuItem>Minuman</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                    <AlertDialog>
                        <AlertDialogTrigger className="p-2 bg-blue-500 text-white rounded-md">
                            + Tambah Tipe Surat
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="">
                                    Buat Tipe Surat Baru
                                </AlertDialogTitle>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name">
                                            Nama Tipe Surat
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            className=" rounded-md"
                                            type="text"
                                            id="name"
                                            name="letter_type_name"
                                        />
                                    </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleSubmit}
                                    className="bg-blue-500"
                                >
                                    Simpan
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="mt-10">
                    <DataTable
                        formData={formData}
                        setFormData={setFormData}
                        data={data}
                        columns={columns}
                        handleDelete={handleDelete}
                        handleChange={handleChange}
                        // role={role}
                        // division={division}
                        handleUpdate={handleUpdate}
                    />
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
