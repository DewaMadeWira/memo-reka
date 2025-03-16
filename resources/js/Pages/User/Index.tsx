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
import { columns } from "./user/columns";

export default function Index() {
    const dataDummy = [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
    ];
    return (
        <SidebarAuthenticated>
            <div className="w-full p-10">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/components">
                                Components
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-2xl">Manajemen Pengguna</h1>

                <div className="w-full flex justify-end items-center mt-2 gap-5">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-black p-2 border border-gray-300 rounded-md w-1/12 text-base">
                            Filter
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                            <DropdownMenuItem>Makan</DropdownMenuItem>
                            <DropdownMenuItem>Minuman</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button className="p-2 bg-blue-500 text-white rounded-md">
                        + Tambah Pengguna
                    </button>
                </div>
                <div className="mt-10">
                    <DataTable data={dataDummy} columns={columns} />
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
