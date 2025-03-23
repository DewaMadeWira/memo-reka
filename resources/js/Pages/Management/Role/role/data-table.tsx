"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

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
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { Role } from "@/types/RoleType";
import { Division } from "@/types/DivisionType";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    handleDelete: (id: number) => void;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    handleUpdate: (id: number) => void;
    formData: {
        name: string;
        email: string;
        password: string;
        role_id: number;
        division_id: number;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            name: string;
            email: string;
            password: string;
            role_id: number;
            division_id: number;
        }>
    >;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    handleDelete,
    handleChange,
    handleUpdate,
    // role,
    // division,
    formData,
    setFormData,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 2, // or whatever default page size you want
    });

    const setEdit = (data: any) => {
        console.log(data);
        // setFormData(data);
        setFormData({
            name: data.name,
            email: data.email,
            password: "",
            role_id: Number(data.role_id),
            division_id: Number(data.division_id),
        });
    };
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {/* <TableHead className="text-center">
                                    Nomor
                                </TableHead> */}
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-center"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                                <TableHead className="text-center">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className="text-center"
                                >
                                    {/* <TableCell>{index + 1}</TableCell> */}
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <div className="flex gap-2 justify-center">
                                            <AlertDialog>
                                                <AlertDialogTrigger
                                                    onClick={() =>
                                                        setEdit(row.original)
                                                    }
                                                    className="p-2 bg-blue-500 text-white rounded-md"
                                                >
                                                    Edit
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="">
                                                            Buat Pengguna Baru
                                                        </AlertDialogTitle>
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="name">
                                                                    Nama
                                                                </label>
                                                                <input
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    className=" rounded-md"
                                                                    type="text"
                                                                    id="name"
                                                                    name="name"
                                                                    value={
                                                                        formData.name
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="email">
                                                                    Email
                                                                </label>
                                                                <input
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    className=" rounded-md"
                                                                    type="email"
                                                                    name="email"
                                                                    value={
                                                                        formData.email
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="password">
                                                                    Password
                                                                </label>
                                                                <input
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    className=" rounded-md"
                                                                    type="password"
                                                                    name="password"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="role_id">
                                                                    Role
                                                                </label>
                                                                <select
                                                                    value={
                                                                        formData.role_id
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    name="role_id"
                                                                    id=""
                                                                    className=" rounded-md"
                                                                >
                                                                    <option value="">
                                                                        Pilih
                                                                        Role
                                                                    </option>
                                                                    {/* {role.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <option
                                                                                value={
                                                                                    item.id
                                                                                }
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.role_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )} */}
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="division_id">
                                                                    Divisi
                                                                </label>
                                                                <select
                                                                    value={
                                                                        formData.division_id
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    name="division_id"
                                                                    id=""
                                                                    className=" rounded-md"
                                                                >
                                                                    <option value="">
                                                                        Pilih
                                                                        Divisi
                                                                    </option>
                                                                    {/* {division.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <option
                                                                                value={
                                                                                    item.id
                                                                                }
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.division_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )} */}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Kembali
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleUpdate(
                                                                    Number(
                                                                        row
                                                                            .original
                                                                            .id
                                                                    )
                                                                )
                                                            }
                                                            className="bg-blue-500"
                                                        >
                                                            Simpan
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    Hapus
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Apakah anda yakin ?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Data yang dipilih
                                                            akan dihapus
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Kembali
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    Number(
                                                                        row
                                                                            .original
                                                                            .id
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
