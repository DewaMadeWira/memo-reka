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
} from "lucide-react";
import ApplicationLogo from "./ApplicationLogo";

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
        title: "Settings",
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <a href={items[1].url}>
                                            <div className="w-10 flex justify-center items-center">
                                                <NotebookText />
                                            </div>
                                            <span className="text-base">
                                                {items[1].title}
                                            </span>
                                            <ChevronDown></ChevronDown>
                                        </a>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuItem>
                                        Semua {items[1].title}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {items[1].title} Internal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {items[1].title} Eksternal
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <a href={items[2].url}>
                                            <div className="w-10 flex justify-center items-center">
                                                <File />
                                            </div>
                                            <span className="text-base">
                                                {items[2].title}
                                            </span>
                                            <ChevronDown></ChevronDown>
                                        </a>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuItem>
                                        Semua {items[2].title}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {items[2].title} Internal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {items[2].title} Eksternal
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mt-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <a href={items[3].url}>
                                            <div className="w-10 flex justify-center items-center">
                                                <FilePlus2 />
                                            </div>
                                            <span className="text-base">
                                                {items[3].title}
                                            </span>
                                            <ChevronDown></ChevronDown>
                                        </a>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuItem>
                                        Semua {items[3].title}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {items[3].title} Internal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {items[3].title} Eksternal
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
