import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import { Head } from "@inertiajs/react";
import { FileText, Calendar, FileCheck } from "lucide-react";
import { LineChartComponent } from "./Charts/LineChart";

export default function Dashboard({
    memoCount,
    invitationCount,
    summaryCount,
    chartData,
}: {
    memoCount: number;
    invitationCount: number;
    summaryCount: number;
    chartData: any;
}) {
    console.log(chartData);
    return (
        <SidebarAuthenticated>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6">
                            Dashboard Overview
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Memo Card */}
                            <div className="bg-blue-50 rounded-lg p-6 shadow-md transition-all hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total Memo
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {memoCount}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <FileText className="h-8 w-8 text-blue-500" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">
                                    Semua Memo dalam sistem
                                </p>
                            </div>

                            {/* Undangan Rapat Card */}
                            <div className="bg-green-50 rounded-lg p-6 shadow-md transition-all hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Undangan Rapat
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {invitationCount}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <Calendar className="h-8 w-8 text-green-500" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">
                                    Semua Undangan Rapat dalam sistem
                                </p>
                            </div>

                            {/* Risalah Rapat Card */}
                            <div className="bg-purple-50 rounded-lg p-6 shadow-md transition-all hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Risalah Rapat
                                        </p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {summaryCount}
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <FileCheck className="h-8 w-8 text-purple-500" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">
                                    Semua Risalah Rapat dalam sistem
                                </p>
                            </div>
                        </div>
                        <div className="mt-5">
                            <LineChartComponent
                                chartData={chartData}
                            ></LineChartComponent>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
