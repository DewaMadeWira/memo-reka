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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { DataTable } from "./official/data-table";
import { columns } from "./official/columns";
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
import { router } from "@inertiajs/react";
import { Official } from "@/types/OfficialType";
import { useToast } from "@/hooks/use-toast";

export default function Index({ data }: { data: Official[] }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        official_name: "",
        official_code: "",
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
        console.log(formData);
        router.post("/admin/manajemen-pejabat", formData, {
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
                    description: "Pejabat berhasil ditambahkan",
                });
            },
        });
    };
    const handleDelete = (id: number) => {
        console.log(formData);
        router.delete(`/admin/manajemen-pejabat/${id}`, {
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
                    description: "Pejabat berhasil dihapus",
                });
            },
        });
    };
    const handleUpdate = (id: number) => {
        const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== "")
        );

        console.log(filteredData);
        // console.log(formData);
        console.log(id);
        router.put(`/admin/manajemen-pejabat/${id}`, filteredData, {
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
                    description: "Pejabat berhasil diupdate",
                });
            },
        });
    };
    console.log(data);

    return (
        <SidebarAuthenticated>
            <div className="w-full p-10">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Manajemen Pejabat</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-2xl">Manajemen Pejabat</h1>

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
                            + Tambah Pejabat
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="">
                                    Buat Pejabat Baru
                                </AlertDialogTitle>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="official_name">
                                            Nama Jabatan
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            className=" rounded-md"
                                            type="text"
                                            id="official_name"
                                            name="official_name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="official_code">
                                            Kode Jabatan
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            className=" rounded-md"
                                            type="text"
                                            id="official_code"
                                            name="official_code"
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
                        handleUpdate={handleUpdate}
                    />
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
