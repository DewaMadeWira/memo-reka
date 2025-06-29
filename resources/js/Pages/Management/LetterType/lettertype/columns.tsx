"use client";

import { Button } from "@/Components/ui/button";
import { LetterType } from "@/types/LetterTypeType";
import { Role } from "@/types/RoleType";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<LetterType>[] = [
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
        accessorKey: "letter_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Tipe Surat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    // {
    //     accessorKey: "division.division_name",
    //     header: "Divisi",
    // },
    // {
    //     accessorKey: "role.role_name",
    //     header: "Role",
    // },
    // {
    //     accessorKey: "email",
    //     header: "Email",
    // },
];
