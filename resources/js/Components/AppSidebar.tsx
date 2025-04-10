import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/Components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

import {
    Calendar,
    ChartBarBig,
    ChevronDown,
    File,
    FilePlus2,
    Home,
    Inbox,
    NotebookText,
    Search,
    Settings,
    Users,
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";

import ApplicationLogo from "./ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { url } from "inspector";

const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: ChartBarBig,
        subItems: [], // No subitems for dashboard
    },
    {
        title: "Memo",
        url: "/admin/memo",
        icon: NotebookText,
        subItems: [{ title: "Semua Memo", url: "/memo" }],
    },
    {
        title: "Undangan Rapat",
        url: "/admin/undangan-rapat",
        icon: Calendar,
        subItems: [
            { title: "Makan", url: "/admin/undangan-rapat/makan" },
            { title: "Siang", url: "/admin/undangan-rapat/siang" },
        ],
    },
    {
        title: "Risalah Rapat",
        url: "#",
        icon: Search,
        subItems: [
            { title: "Makan", url: "/risalah-rapat/makan" },
            { title: "Siang", url: "/risalah-rapat/siang" },
        ],
    },
    {
        title: "Manajemen",
        url: "/admin/manajemen",
        icon: Settings,
        subItems: [
            { title: "Akun dan Pengguna", type: "separator" },
            { title: "Pengguna", url: "/admin/manajemen-pengguna" },
            { title: "Role", url: "/admin/manajemen-role" },
            { title: "Divisi", url: "/admin/manajemen-divisi" },
            { title: "Surat", type: "separator" },
            {
                title: "Tahapan Surat",
                url: "/admin/tahapan-surat",
            },
        ],
    },
];
export function AppSidebar() {
    const { url } = usePage();
    return (
        <Sidebar collapsible="icon" className="w-1/6 ">
            <SidebarHeader className="bg-white flex justify-center w-full items-center ">
                <ApplicationLogo width={150} height={150}></ApplicationLogo>
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <SidebarGroup />
                <SidebarGroupLabel className="text-xs ml-1 text-black">
                    MENU
                </SidebarGroupLabel>
                <SidebarGroupContent className="ml-1 w-[90%]">
                    <SidebarMenu>
                        {items.map((item, index) => (
                            <SidebarMenuItem key={item.title} className="mt-1">
                                {item.subItems.length > 0 ? (
                                    <Collapsible className="group/collapsible">
                                        <CollapsibleTrigger
                                            className={`flex w-full items-center font-medium p-2 rounded-md
                                                hover:bg-violet-300 hover:text-violet-800
                                                ${
                                                    url.startsWith(item.url)
                                                        ? "bg-violet-300 text-violet-800"
                                                        : ""
                                                }`}
                                        >
                                            <div className="w-10 flex justify-center items-center">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="text-sm">
                                                {item.title}
                                            </span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="flex flex-col gap-[0.5] ml-10">
                                            {item.subItems.map((subItem) =>
                                                subItem.type === "separator" ? (
                                                    <div
                                                        key={subItem.title}
                                                        className="text-sm font-medium text-gray-500 mt-3 mb-1 px-2"
                                                    >
                                                        {subItem.title}
                                                    </div>
                                                ) : (
                                                    <Link
                                                        key={subItem.title}
                                                        className="mt-1 pl-5 p-2 hover:bg-gray-200 rounded-md text-xs"
                                                        href={subItem.url!}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                )
                                            )}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuButton asChild>
                                        <a
                                            href={item.url}
                                            className={`flex w-full items-center font-medium px-2 py-5 rounded-md
                                                hover:bg-violet-300 hover:text-violet-800
                                                ${
                                                    url.startsWith(item.url)
                                                        ? "bg-violet-300 text-violet-800"
                                                        : ""
                                                }`}
                                        >
                                            <div className="w-7 ml-1 flex justify-center items-center">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="text-sm">
                                                {item.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
