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
import { Link } from "@inertiajs/react";

const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: ChartBarBig,
    },
    {
        title: "Memo",
        url: "#",
        icon: NotebookText,
    },
    {
        title: "Undangan Rapat",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Risalah Rapat",
        url: "#",
        icon: Search,
    },
    {
        title: "Manajemen",
        url: "#",
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" className="w-1/6 ">
            {/* <SidebarHeader /> */}
            <SidebarHeader className="bg-white flex justify-center w-full items-center ">
                <ApplicationLogo width={150} height={150}></ApplicationLogo>
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <SidebarGroup />
                <SidebarGroupLabel className="text-base">
                    Menu
                </SidebarGroupLabel>
                <SidebarGroupContent className="ml-1 w-[90%]">
                    <SidebarMenu>
                        <SidebarMenuItem className="mt-1">
                            <SidebarMenuButton asChild>
                                <a href={items[0].url}>
                                    <div className="w-10 flex justify-center items-center">
                                        <ChartBarBig />
                                    </div>
                                    <span className="text-base">
                                        {items[0].title}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-1">
                            <Collapsible className="group/collapsible">
                                <CollapsibleTrigger className="flex w-full hover:bg-gray-200 p-2 rounded-md ">
                                    <div className="w-10 flex justify-center items-center">
                                        <NotebookText />
                                    </div>
                                    <span className="text-base">
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
                                <CollapsibleTrigger className="flex w-full hover:bg-gray-200 p-2 rounded-md ">
                                    <div className="w-10 flex justify-center items-center">
                                        <File />
                                    </div>
                                    <span className="text-base">
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
                                    <span className="text-base">
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
                                <CollapsibleTrigger className="flex w-full hover:bg-gray-200 p-2 rounded-md ">
                                    <div className="w-10 flex justify-center items-center">
                                        <Users></Users>
                                    </div>
                                    <span className="text-base">
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
                                        <span className="text-base">
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
