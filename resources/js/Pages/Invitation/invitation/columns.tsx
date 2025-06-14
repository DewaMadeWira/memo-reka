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
        id: "rowNumber",
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
        accessorFn: (_, index) => index + 1,
        cell: ({ getValue }) => getValue(),
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
        accessorKey: "invite.invitation_number",
        header: "Nomor Undangan",
    },
    {
        accessorKey: "invite.to_division.division_name",
        header: "Divisi Tujuan",
    },
    {
        accessorKey: "stages.status.status_name",
        header: "Status",
    },
];
