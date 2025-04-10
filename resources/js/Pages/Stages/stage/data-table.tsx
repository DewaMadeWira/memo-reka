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
    // statuses: Status[];
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
    // handleReject: (id: number) => void;
    // formData: {
    //     role_name: string;
    // };
    // setFormData: React.Dispatch<
    //     React.SetStateAction<{
    //         role_name: string;
    //     }>
    // >;
}

export function DataTable<TData extends Stages, TValue>({
    columns,
    data,
    // status,
    role,
    letter,
    handleUpdate,
    handleChange,
    user,
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
