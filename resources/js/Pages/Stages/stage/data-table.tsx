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
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { User } from "@/types/UserType";
import { Stages } from "@/types/StagesType";
import { Status } from "@/types/StatusType";
import { Letter } from "@/types/LetterType";
import { Role } from "@/types/RoleType";

interface DataTableProps<TData extends Stages, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    user: User;
    statuses: Status[];
    letter: Letter[];
    role: Role[];
    // handleDelete: (id: number) => void;

    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    handleUpdate: ({
        id,
        field,
        value,
    }: {
        id: number;
        field: "to_stage_id" | "rejected_id";
        value: number;
    }) => void;
    deleteStages: (id: number) => void;
    handleEdit: (id: number) => void;
    // handleReject: (id: number) => void;
    formData: {
        stage_name: string;
        sequence: string;
        to_stage_id: string;
        rejected_id: string;
        letter_id: string;
        approver_id: string;
        status_id: string;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            stage_name: string;
            sequence: string;
            to_stage_id: string;
            rejected_id: string;
            letter_id: string;
            approver_id: string;
            status_id: string;
        }>
    >;
}

export function DataTable<TData extends Stages, TValue>({
    columns,
    data,
    deleteStages,
    role,
    letter,
    handleUpdate,
    handleChange,
    handleEdit,
    user,
    statuses,
    setFormData,
    formData,
}: // handleDelete,
// role,

// division,
// formData,
// setFormData,
DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, // or whatever default page size you want
    });

    const setEdit = (data: any) => {
        // alert("Edit");
        // console.log(data);
        // setFormData(data);
        // setFormData({
        //     role_name: data.role_name,
        // });
        // console.log(formData);
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
                                    Tahapan disetujui
                                </TableHead>
                                <TableHead className="text-center">
                                    Tahapan ditolak
                                </TableHead>
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
                                    <TableCell className="max-w-[500px] truncate">
                                        <select
                                            name=""
                                            id=""
                                            className="w-full text-sm p-2 border border-slate-200 rounded-lg truncate pr-5"
                                            onChange={(e) =>
                                                handleUpdate({
                                                    id: row.original.id,
                                                    field: "to_stage_id",
                                                    value: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            defaultValue={
                                                row.original.request_approved
                                                    ?.id
                                            }
                                        >
                                            <option value={-1}>Null</option>
                                            {data.map((stage: any) => (
                                                <option value={stage.id}>
                                                    {stage.stage_name}
                                                </option>
                                            ))}
                                        </select>
                                    </TableCell>
                                    <TableCell className="max-w-[500px] truncate">
                                        <select
                                            name=""
                                            id=""
                                            className="w-full p-2 border border-slate-200 text-sm rounded-lg truncate pr-5"
                                            onChange={(e) =>
                                                handleUpdate({
                                                    id: row.original.id,
                                                    field: "rejected_id",
                                                    value: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            defaultValue={
                                                row.original.request_rejected
                                                    ?.id
                                            }
                                        >
                                            <option value={-1}>Null</option>
                                            {data.map((stage: any) => (
                                                <option
                                                    className=""
                                                    value={stage.id}
                                                >
                                                    {stage.stage_name}
                                                </option>
                                            ))}
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger
                                                    onClick={() =>
                                                        setFormData({
                                                            approver_id:
                                                                row.original
                                                                    .approver_id,
                                                            letter_id:
                                                                row.original
                                                                    .letter_id,
                                                            rejected_id:
                                                                row.original
                                                                    .rejected_id,
                                                            sequence:
                                                                row.original
                                                                    .sequence,
                                                            stage_name:
                                                                row.original
                                                                    .stage_name,
                                                            status_id:
                                                                row.original
                                                                    .status_id,
                                                            to_stage_id:
                                                                row.original
                                                                    .to_stage_id,
                                                        })
                                                    }
                                                    className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                                                        user.role_id == 2
                                                            ? "hidden"
                                                            : ""
                                                    }`}
                                                >
                                                    Edit
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="w-[300rem]">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Edit Tahapan Baru
                                                        </AlertDialogTitle>
                                                        <div className="">
                                                            <label
                                                                htmlFor="stage_name"
                                                                className="block mb-2"
                                                            >
                                                                Stage Name
                                                            </label>
                                                            <input
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                type="text"
                                                                name="stage_name"
                                                                id=""
                                                                value={
                                                                    formData.stage_name
                                                                }
                                                                className="w-full p-2 border rounded-lg"
                                                            />
                                                            <label
                                                                htmlFor="sequence"
                                                                className="block mb-2"
                                                            >
                                                                Sequence
                                                            </label>
                                                            <select
                                                                name="sequence"
                                                                id=""
                                                                className="w-full p-2 border rounded-lg"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    formData.sequence
                                                                }
                                                            >
                                                                <option>
                                                                    Pilih Opsi
                                                                </option>
                                                                <option
                                                                    value={1}
                                                                >
                                                                    First
                                                                </option>
                                                                <option
                                                                    value={0}
                                                                >
                                                                    Not First
                                                                </option>
                                                            </select>
                                                            <label
                                                                htmlFor="letter_id"
                                                                className="block mb-2"
                                                            >
                                                                Letter Type
                                                            </label>
                                                            <select
                                                                name="letter_id"
                                                                id=""
                                                                className="w-full p-2 border rounded-lg"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    formData.letter_id
                                                                }
                                                            >
                                                                <option>
                                                                    Pilih Opsi
                                                                </option>
                                                                {letter.map(
                                                                    (
                                                                        stage: any
                                                                    ) => (
                                                                        <option
                                                                            value={
                                                                                stage.id
                                                                            }
                                                                        >
                                                                            {
                                                                                stage.letter_name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <label
                                                                htmlFor="approver_id"
                                                                className="block mb-2"
                                                            >
                                                                Approver
                                                            </label>
                                                            <select
                                                                name="approver_id"
                                                                id=""
                                                                className="w-full p-2 border rounded-lg"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    formData.approver_id
                                                                }
                                                            >
                                                                <option>
                                                                    Pilih Opsi
                                                                </option>
                                                                {role.map(
                                                                    (
                                                                        stage: any
                                                                    ) => (
                                                                        <option
                                                                            value={
                                                                                stage.id
                                                                            }
                                                                        >
                                                                            {
                                                                                stage.role_name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <label
                                                                htmlFor="to_stage_id"
                                                                className="block mb-2"
                                                            >
                                                                To Stage ID
                                                            </label>
                                                            <select
                                                                name="to_stage_id"
                                                                id=""
                                                                className="w-full p-2 border rounded-lg"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    formData.to_stage_id
                                                                }
                                                            >
                                                                <option>
                                                                    Pilih Opsi
                                                                </option>
                                                                {data.map(
                                                                    (
                                                                        stage: any
                                                                    ) => (
                                                                        <option
                                                                            value={
                                                                                stage.id
                                                                            }
                                                                        >
                                                                            {
                                                                                stage.stage_name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <label
                                                                htmlFor="rejected_id"
                                                                className="block mb-2"
                                                            >
                                                                Rejected ID
                                                            </label>
                                                            <select
                                                                name="rejected_id"
                                                                id=""
                                                                className="w-full p-2 border rounded-lg"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    formData.rejected_id
                                                                }
                                                            >
                                                                <option>
                                                                    Pilih Opsi
                                                                </option>
                                                                {data.map(
                                                                    (
                                                                        stage: any
                                                                    ) => (
                                                                        <option
                                                                            value={
                                                                                stage.id
                                                                            }
                                                                        >
                                                                            {
                                                                                stage.stage_name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            <label
                                                                htmlFor="status_id"
                                                                className="block mb-2"
                                                            >
                                                                Status
                                                            </label>
                                                            <select
                                                                name="status_id"
                                                                id=""
                                                                className="w-full p-2 border rounded-lg"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    formData.status_id
                                                                }
                                                            >
                                                                <option>
                                                                    Pilih Opsi
                                                                </option>
                                                                {statuses.map(
                                                                    (
                                                                        status: any
                                                                    ) => (
                                                                        <option
                                                                            value={
                                                                                status.id
                                                                            }
                                                                        >
                                                                            {
                                                                                status.status_name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Kembali
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-green-500"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    row.original
                                                                        .id
                                                                )
                                                            }
                                                        >
                                                            Buat Tahapan
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <button
                                                onClick={() =>
                                                    deleteStages(
                                                        row.original.id
                                                    )
                                                }
                                                className={`bg-red-500 p-2 mt-2 text-white rounded-lg
                                        `}
                                            >
                                                Delete
                                            </button>
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
