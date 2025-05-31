import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { DataTable } from "./role/data-table";
import { columns } from "./role/columns";
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
import { Role } from "@/types/RoleType";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";

export default function Index({ roles }: { roles: Role[] }) {
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        role_name: "",
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
        router.post("/admin/manajemen-role", formData, {
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
                    description: "Role berhasil ditambahkan",
                });
            },
        });
    };
    const handleDelete = (id: number) => {
        // console.log(formData);
        router.delete(`/admin/manajemen-role/${id}`, {
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Role berhasil dihapus",
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
        router.put(`/admin/manajemen-role/${id}`, formData, {
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
                    description: "Role berhasil diubah",
                });
            },
        });
    };
    console.log(roles);

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
                            <BreadcrumbPage>Manajemen Role</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-2xl">Manajemen Role</h1>

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
                        {/* <AlertDialogTrigger className="p-2 bg-blue-500 text-white rounded-md">
                            + Tambah Role
                        </AlertDialogTrigger> */}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="">
                                    Buat Role Baru
                                </AlertDialogTitle>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name">Nama Role</label>
                                        <input
                                            onChange={handleChange}
                                            className=" rounded-md"
                                            type="text"
                                            id="name"
                                            name="role_name"
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
                        data={roles}
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
