import React, { PropsWithChildren } from "react";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/AppSidebar";
import Authenticated from "./AuthenticatedLayout";

export default function SidebarAuthenticated({
    children,
    notifications,
}: {
    children: React.ReactNode;
    notifications: any;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            {/* <main> */}
            {/* <SidebarTrigger /> */}
            <div className="w-full bg-white">
                {/* <SidebarTrigger /> */}
                <Authenticated>{children}</Authenticated>
            </div>
            {/* </main> */}
        </SidebarProvider>
    );
}
