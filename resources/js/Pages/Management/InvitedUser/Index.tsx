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
import { DataTable } from "./invitedUser/data-table";
import { columns, InvitedUser } from "./invitedUser/columns";
import { Division } from "@/types/DivisionType";
import { Official } from "@/types/OfficialType";

export default function Index({
    invitedUsers,
    division,
    official,
}: {
    invitedUsers: InvitedUser[];
    division: Division[];
    official: Official[];
}) {
    const [formData, setFormData] = useState({
        nama_pengguna: "",
        division_id: 0,
        official_id: 0,
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
        router.post("/admin/manajemen-pengguna-undangan", formData);
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/manajemen-pengguna-undangan/${id}`);
    };

    const handleUpdate = (id: number) => {
        const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== "")
        );

        console.log(filteredData);
        router.put(`/admin/manajemen-pengguna-undangan/${id}`, filteredData);
    };

    return (
        <SidebarAuthenticated>
            <Head title="Manajemen Pengguna Undangan" />
            <div className="w-full p-10">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                Manajemen Pengguna Undangan
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-2xl">
                    Manajemen Pengguna Undangan
                </h1>

                <div className="w-full flex justify-end items-center mt-2 gap-5">
                    <AlertDialog>
                        <AlertDialogTrigger className="p-2 bg-blue-500 text-white rounded-md">
                            + Tambah Pengguna Undangan
                        </AlertDialogTrigger>
                        <AlertDialogContent className=" ">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="">
                                    Buat Pengguna Undangan Baru
                                </AlertDialogTitle>
                                <div className="flex flex-col gap-3 max-w-md">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="nama_pengguna">
                                            Nama Pengguna
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            className="rounded-md"
                                            type="text"
                                            id="nama_pengguna"
                                            name="nama_pengguna"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="divisi">Divisi</label>
                                        <select
                                            onChange={handleChange}
                                            name="division_id"
                                            id=""
                                            className="rounded-md"
                                        >
                                            <option value="">
                                                Pilih Divisi
                                            </option>
                                            {division.map((item) => (
                                                <option
                                                    value={item.id}
                                                    key={item.id}
                                                >
                                                    {item.division_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="official">
                                            Pejabat
                                        </label>
                                        <select
                                            onChange={handleChange}
                                            name="official_id"
                                            id=""
                                            className="rounded-md"
                                        >
                                            <option value="">
                                                Pilih Pejabat
                                            </option>
                                            {official.map((item) => (
                                                <option
                                                    value={item.id}
                                                    key={item.id}
                                                >
                                                    {item.official_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="max-w-md">
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
                        data={invitedUsers}
                        columns={columns}
                        handleDelete={handleDelete}
                        handleChange={handleChange}
                        division={division}
                        official={official}
                        handleUpdate={handleUpdate}
                    />
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
