import { ColumnDef } from "@tanstack/react-table";
import { InvitedUser } from "@/types/InvitedUserType";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
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
import React from "react";
import { Division } from "@/types/DivisionType";
import { Official } from "@/types/OfficialType";

export const columns: ColumnDef<InvitedUser>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "nama_pengguna",
        header: "Nama Pengguna",
    },
    {
        accessorKey: "division.division_name",
        header: "Divisi",
    },
    {
        accessorKey: "official.official_name",
        header: "Pejabat",
    },
    {
        id: "actions",
        cell: function Cell({ row, table }) {
            const invitedUser = row.original;
            const {
                handleDelete,
                handleChange,
                handleUpdate,
                division,
                official,
                formData,
                setFormData,
            } = table.options.meta as {
                handleDelete: (id: number) => void;
                handleChange: (
                    e: React.ChangeEvent<
                        | HTMLInputElement
                        | HTMLSelectElement
                        | HTMLTextAreaElement
                    >
                ) => void;
                handleUpdate: (id: number) => void;
                division: Division[];
                official: Official[];
                formData: any;
                setFormData: React.Dispatch<React.SetStateAction<any>>;
            };

            return (
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setFormData({
                                            nama_pengguna:
                                                invitedUser.nama_pengguna,
                                            division_id:
                                                invitedUser.division_id,
                                            official_id:
                                                invitedUser.official_id,
                                        });
                                    }}
                                >
                                    Edit
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <DropdownMenuItem
                                onClick={() => handleDelete(invitedUser.id)}
                                className="text-red-600"
                            >
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Edit Pengguna Undangan
                            </AlertDialogTitle>
                            <div className="flex flex-col gap-3 max-w-md">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="nama_pengguna">
                                        Nama Pengguna
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.nama_pengguna}
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
                                        value={formData.division_id}
                                        name="division_id"
                                        id="division_id"
                                        className="rounded-md"
                                    >
                                        <option value="">Pilih Divisi</option>
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
                                    <label htmlFor="official">Pejabat</label>
                                    <select
                                        onChange={handleChange}
                                        value={formData.official_id}
                                        name="official_id"
                                        id="official_id"
                                        className="rounded-md"
                                    >
                                        <option value="">Pilih Pejabat</option>
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
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleUpdate(invitedUser.id)}
                                className="bg-blue-500"
                            >
                                Simpan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];

export type { InvitedUser };
