import React, { PropsWithChildren } from "react";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/AppSidebar";

export default function SidebarAuthenticated({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            {/* <main> */}
            <SidebarTrigger />
            {children}
            {/* </main> */}
        </SidebarProvider>
    );
}
