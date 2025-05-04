import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { SidebarTrigger } from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
// Import shadcn components
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";

export default function Authenticated({
    header,
    children,
    notifications,
}: PropsWithChildren<{ header?: ReactNode; notifications: any }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter notifications based on search query
    const filteredNotifications = notifications.filter(
        (notification: any) =>
            notification.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            notification.message
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    console.log(notifications);
    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-full px-4 sm:px-6 lg:px-8 ">
                    <div className="flex h-16 justify-between items-center">
                        <SidebarTrigger></SidebarTrigger>
                        {/* <div className="flex">
                            <div className="flex shrink-0 items-center ">
                                <Link href="/">
                                    <ApplicationLogo
                                        width={100}
                                        height={100}
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div> */}

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {/* Notification Icon and Dropdown using shadcn */}
                            <div className="relative ms-3 mr-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="relative"
                                        >
                                            <Bell className="h-5 w-5" />
                                            {notifications.length > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-80"
                                    >
                                        <div className="flex flex-col">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    Notifications
                                                </h3>
                                                <Input
                                                    type="text"
                                                    placeholder="Search notifications..."
                                                    className="mt-2 w-full"
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <ScrollArea className="h-64">
                                                {filteredNotifications.length ===
                                                0 ? (
                                                    <div className="py-4 px-4 text-sm text-gray-500 text-center">
                                                        No notifications found
                                                    </div>
                                                ) : (
                                                    filteredNotifications.map(
                                                        (notification: any) => (
                                                            <div
                                                                key={
                                                                    notification.id
                                                                }
                                                                className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                                            >
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500 whitespace-normal break-words">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {new Date(
                                                                        notification.created_at
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        )
                                                    )
                                                )}
                                            </ScrollArea>

                                            {/* {filteredNotifications.length >
                                                0 && (
                                                <div className="px-4 py-2 border-t border-gray-200">
                                                    <Link
                                                        // href={route(
                                                        //     "notifications.index"
                                                        // )}
                                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View all notifications
                                                    </Link>
                                                </div>
                                            )} */}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>

                                        <Dropdown.Link
                                            method="post"
                                            as="button"
                                            href={route("logout")}
                                        >
                                            Logout
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
