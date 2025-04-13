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
import { DataTable } from "./user/data-table";
import { columns, User } from "./user/columns";
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
import { Division } from "@/types/DivisionType";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";

export default function Index({
    users,
    role,
    division,
}: {
    users: User[];
    role: Role[];
    division: Division[];
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role_id: 0,
        division_id: 0,
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
        router.post("/admin/manajemen-pengguna", formData);
    };
    const handleDelete = (id: number) => {
        console.log(formData);
        router.delete(`/admin/manajemen-pengguna/${id}`);
    };
    const handleUpdate = (id: number) => {
        const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== "")
        );

        console.log(filteredData);
        // console.log(formData);
        console.log(id);
        router.put(`/admin/manajemen-pengguna/${id}`, filteredData);
    };
    console.log(users);

    return (
        <SidebarAuthenticated>
            <Head title="Manajemen Pengguna"  />
            <div className="w-full p-10">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Manajemen Pengguna</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-2xl">Manajemen Pengguna</h1>

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
                            + Tambah Pengguna
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="">
                                    Buat Pengguna Baru
                                </AlertDialogTitle>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name">Nama</label>
                                        <input
                                            onChange={handleChange}
                                            className=" rounded-md"
                                            type="text"
                                            id="name"
                                            name="name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            onChange={handleChange}
                                            className=" rounded-md"
                                            type="email"
                                            name="email"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            className=" rounded-md"
                                            type="password"
                                            name="password"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="role">Role</label>
                                        <select
                                            onChange={handleChange}
                                            name="role_id"
                                            id=""
                                            className=" rounded-md"
                                        >
                                            <option value="">Pilih Role</option>
                                            {role.map((item) => (
                                                <option
                                                    value={item.id}
                                                    key={item.id}
                                                >
                                                    {item.role_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="divisi">Divisi</label>
                                        <select
                                            onChange={handleChange}
                                            name="division_id"
                                            id=""
                                            className=" rounded-md"
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
                        data={users}
                        columns={columns}
                        handleDelete={handleDelete}
                        handleChange={handleChange}
                        role={role}
                        division={division}
                        handleUpdate={handleUpdate}
                    />
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
