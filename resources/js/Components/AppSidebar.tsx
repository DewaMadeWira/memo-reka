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
    },
    {
        title: "Memo",
        url: "/admin/memo",
        icon: NotebookText,
    },
    {
        title: "Undangan Rapat",
        url: "admin/undangan-rapat",
        icon: Calendar,
    },
    {
        title: "Risalah Rapat",
        url: "#",
        icon: Search,
    },
    {
        title: "Manajemen",
        url: "/admin/manajemen",
        icon: Settings,
    },
];

export function AppSidebar() {
    const { url } = usePage();
    return (
        <Sidebar collapsible="icon" className="w-1/6 ">
            {/* <SidebarHeader /> */}
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
                        <SidebarMenuItem className="mt-1">
                            <SidebarMenuButton asChild>
                                <a href={items[0].url}>
                                    <div className="w-7 ml-1 flex justify-center items-center">
                                        <ChartBarBig />
                                    </div>
                                    <span className="text-sm">
                                        {items[0].title}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-1">
                            <Collapsible className="group/collapsible">
                                <CollapsibleTrigger
                                    className={`flex w-full items-center font-medium p-2 rounded-md
                                            hover:bg-violet-300 hover:text-violet-800
                                        ${
                                            url.startsWith(items[1].url)
                                                ? "bg-violet-300 text-violet-800"
                                                : ""
                                        }`}
                                >
                                    <div className="w-10 flex justify-center items-center">
                                        <NotebookText />
                                    </div>
                                    <span className="text-sm ">
                                        {items[1].title}
                                    </span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col gap-[0.5] ml-10">
                                    <a
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                        href=""
                                    >
                                        Makan
                                    </a>
                                    <a
                                        href=""
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                    >
                                        Siang
                                    </a>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-1">
                            <Collapsible className="group/collapsible">
                                <CollapsibleTrigger
                                    className={`flex w-full items-center font-medium p-2 rounded-md
                                            hover:bg-violet-300 hover:text-violet-800
                                        ${
                                            url.startsWith(items[2].url)
                                                ? "bg-violet-300 text-violet-800"
                                                : ""
                                        }`}
                                >
                                    <div className="w-10 flex justify-center items-center">
                                        <File />
                                    </div>
                                    <span className="text-sm">
                                        {items[2].title}
                                    </span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col gap-[0.5] ml-10">
                                    <a
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                        href=""
                                    >
                                        Makan
                                    </a>
                                    <a
                                        href=""
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                    >
                                        Siang
                                    </a>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-1">
                            <Collapsible className="group/collapsible">
                                <CollapsibleTrigger className="flex w-full hover:bg-gray-200 p-2 rounded-md ">
                                    <div className="w-10 flex justify-center items-center">
                                        <FilePlus2 />
                                    </div>
                                    <span className="text-sm">
                                        {items[3].title}
                                    </span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col gap-[0.5] ml-10">
                                    <a
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                        href=""
                                    >
                                        Makan
                                    </a>
                                    <a
                                        href=""
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                    >
                                        Siang
                                    </a>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-1">
                            <Collapsible className="group/collapsible">
                                <CollapsibleTrigger
                                    className={`flex w-full items-center font-medium p-2 rounded-md
                                            hover:bg-violet-300 hover:text-violet-800
                                        ${
                                            url.startsWith(items[4].url)
                                                ? "bg-violet-300 text-violet-800"
                                                : ""
                                        }`}
                                >
                                    <div className="w-10 flex justify-center items-center">
                                        <Users></Users>
                                    </div>
                                    <span className="text-sm">
                                        {items[4].title}
                                    </span>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col gap-[0.5] ml-10">
                                    <Link
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                        href="/admin/manajemen-pengguna"
                                    >
                                        Manajemen Pengguna
                                    </Link>
                                    <Link
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                        href="/admin/manajemen-role"
                                    >
                                        Manajemen Role
                                    </Link>
                                    <Link
                                        className="mt-1 p-2 hover:bg-gray-200 rounded-md"
                                        href="/admin/manajemen-divisi"
                                    >
                                        Manajemen Divisi
                                    </Link>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarMenuItem>
                        {/* {items.map((item) => (
                            <SidebarMenuItem key={item.title} className="mt-1">
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <div className="w-10 flex justify-center items-center">
                                            <item.icon />
                                        </div>
                                        <span className="text-sm">
                                            {item.title}
                                        </span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))} */}
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
