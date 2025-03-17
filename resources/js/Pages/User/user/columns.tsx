"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
    nama: string;
    divisi: string;
    role: string;
    email: string;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "division.division_name",
        header: "Divisi",
    },
    {
        accessorKey: "role.role_name",
        header: "Role",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
];
