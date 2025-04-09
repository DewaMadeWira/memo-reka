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
        subItems: [{ title: "Semua Memo", url: "/admin/memo" }],
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
            { title: "Manajemen Pengguna", url: "/admin/manajemen-pengguna" },
            { title: "Manajemen Role", url: "/admin/manajemen-role" },
            { title: "Manajemen Divisi", url: "/admin/manajemen-divisi" },
        ],
    },
];
export function AppSidebar() {
    const { url } = usePage();
    return (
        <Sidebar collapsible="icon" className="w-1/6 ">
            <SidebarHeader className="bg-slate-50 flex justify-center w-full items-center ">
                <ApplicationLogo width={150} height={150}></ApplicationLogo>
            </SidebarHeader>
            <SidebarContent className="bg-slate-50">
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
                                                <item.icon />
                                            </div>
                                            <span className="text-sm">
                                                {item.title}
                                            </span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="flex flex-col gap-[0.5] ml-10">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                                    href={subItem.url}
                                                >
                                                    {subItem.title}
                                                </Link>
                                            ))}
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
                                                <item.icon />
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
