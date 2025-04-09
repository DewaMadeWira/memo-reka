"use client";

import { Button } from "@/Components/ui/button";
import { Memo } from "@/types/MemoType";
import { RequestLetter } from "@/types/RequestType";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<RequestLetter>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nomor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "request_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Permintaan Surat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "memo.memo_number",
        header: "Nomor Surat",
    },
    {
        accessorKey: "memo.to_division.division_name",
        header: "Divisi Tujuan",
    },
    {
        accessorKey: "stages.status.status_name",
        header: "Status",
    },
];
