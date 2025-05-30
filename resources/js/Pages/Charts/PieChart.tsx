"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
// const chartData = [
//     { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//     { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//     { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//     { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//     { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ];

// const chartConfig = {
//     visitors: {
//         label: "Visitors",
//     },
//     chrome: {
//         label: "Chrome",
//         color: "hsl(var(--chart-1))",
//     },
//     safari: {
//         label: "Safari",
//         color: "hsl(var(--chart-2))",
//     },
//     firefox: {
//         label: "Firefox",
//         color: "hsl(var(--chart-3))",
//     },
//     edge: {
//         label: "Edge",
//         color: "hsl(var(--chart-4))",
//     },
//     other: {
//         label: "Other",
//         color: "hsl(var(--chart-5))",
//     },
// } satisfies ChartConfig;
interface PieChartComponentProps {
    memoCount: number;
    summaryCount: number;
    invitationCount: number;
}

export function PieChartComponent({
    memoCount,
    summaryCount,
    invitationCount,
}: PieChartComponentProps) {
    const chartData = [
        { category: "memo", count: memoCount, fill: "var(--color-memo)" },
        {
            category: "summary",
            count: summaryCount,
            fill: "var(--color-summary)",
        },
        {
            category: "invitation",
            count: invitationCount,
            fill: "var(--color-invitation)",
        },
    ];

    const chartConfig = {
        count: {
            label: "Count",
        },
        memo: {
            label: "Memos",
            color: "hsl(var(--chart-1))",
        },
        summary: {
            label: "Summaries",
            color: "hsl(var(--chart-2))",
        },
        invitation: {
            label: "Invitations",
            color: "hsl(var(--chart-3))",
        },
    } satisfies ChartConfig;
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Seluruh Data Surat</CardTitle>
                <CardDescription>
                    Jumlah seluruh surat yang dibuat oleh Divisi
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey="visitors"
                                    hideLabel
                                />
                            }
                        />
                        <Pie data={chartData} dataKey="count">
                            <LabelList
                                dataKey="category"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {/* <div className="flex items-center gap-2 font-medium leading-none">
                    Jumlah seluruh surat yang dibuat oleh Divisi{" "}
                </div> */}
                {/* <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    );
}
